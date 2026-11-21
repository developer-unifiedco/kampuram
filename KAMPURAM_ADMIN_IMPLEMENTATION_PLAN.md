# Kampuram admin and catalogue implementation plan

**Status** Implementation plan. The tasks below are pending.

- [Scope and decisions](#1-release-scope-and-decisions)
- [Skills by task](#2-skills-and-when-to-activate-them)
- [MySQL schema](#3-mysql-schema)
- [Admin screens](#4-screen-and-listing-behaviour)
- [Route and request contract](#5-route-and-data-contract)
- [Uploads and ordering](#6-upload-replacement-visibility-and-deletion)
- [Public integration](#7-public-catalogue-integration)
- [Phases and subtasks](#8-implementation-tasks-in-order)
- [Acceptance checks](#9-test-matrix-and-acceptance-checks)
- [Release inputs and maintenance](#10-release-inputs-and-maintenance)

## 1. Release scope and decisions

Build a small content admin for Kampuram Business Group in the primary Laravel project. The owner signs in, chooses a business, adds or edits an entry, previews it, and chooses whether it is visible. Published entries appear on the public site and send enquiries to WhatsApp.

| Decision | Implementation |
|---|---|
| Application | One Laravel 12 app with React 19, Inertia 2 and MySQL. Use the existing starter and Vite build. |
| Admin identity | Dedicated `admins` table, `Admin` model, `admins` provider and `admin` session guard. Provision the owner account directly. |
| Catalogue | One `listings` table. Four admin sections backed by one list and form implementation. |
| Settings | One `site_settings` row. The owner can edit the shared WhatsApp number. |
| Stored choices | Named constants backed by `TINYINT UNSIGNED`. Use named defaults and comparisons in migrations, PHP and tests. |
| Media | One main upload per entry and one generated poster for a Media video. Manage files on private storage. |
| Publication | Hidden is the default. The owner can explicitly publish on create or afterwards. Publishing and hiding are immediate on a fresh public request. Published edits go live when saved. |
| Launch content | Load owner-approved creatives, card images, book covers and services. Demo entries are suitable for local testing. |
| Release boundary | Catalogue, admin access and WhatsApp enquiries. Banner editing, checkout, stock, orders, customer accounts, analytics and editable site pages belong to later scope. |

Assumptions used for this plan are one owner, one shared WhatsApp number, quote-based Digi World services, and persistent private storage on the selected host. The Digi World sample-work gallery, FAQs, group branding, contact details other than WhatsApp, and banners are maintained as page content. Keep the existing static visual design and visitor flows as the baseline.

The primary project is `C:/wamp64/www/unifiedCo/kampuram`. The companion static site is at `C:/Users/Muhammed Ali/unifiedco/projects/kampuram-media`. Its `AGENTS.md`, `catalogue-data.js`, `catalogue-utils.js`, and six HTML pages establish the public behaviour. `data/listings.json` and `data/site-settings.json` are reference data. The Laravel starter currently uses SQLite locally, so MySQL setup and schema verification are implementation tasks.

## 2. Skills and when to activate them

Read the skill before the first relevant action. The project skills are under `.agents/skills/<name>/SKILL.md`. Host skills are available through the session skill catalogue. Open the primary project's `AGENTS.md` and check `.ai/rules/index.md` and path-scoped rules when present before planning or editing scoped files. Run a keyword search in `.ai/rules` as required by `AGENTS.md`.

| Skill | Use it for |
|---|---|
| `doc-coauthoring` | Maintaining this implementation plan, reconciling decisions against the project notes, and reviewing the plan for a reader joining the project. |
| `laravel-best-practices` | MySQL migrations and indexes, models and casts, the admin guard, Form Requests, route definitions, storage, ordering transactions, public queries, recovery and security review. Read its applicable rule files for each task. |
| `inertia-react-development` | Admin and public page props, links, mutations, forms, upload progress, flash messages, search navigation and pagination. |
| `tailwindcss-development` | Tailwind utilities for responsive navigation, form spacing, lists, status labels, buttons, focus and mobile layout. |
| `frontend-design` | Screen hierarchy, typography, reader-friendly wording, mobile forms, and visual parity when connecting the public designs. Use the existing components and the established Kampuram brand. |
| `testing-best-practices` | Pest feature and unit coverage, factory states, guarded requests, storage fakes, meaningful failure cases, and review of the affected suite. |
| `computer-use:computer-use` | Browser or native-app verification when a purpose-built tool is insufficient. Check the owner flow, mobile layout, previews, video playback and public visual parity. |
| `deploying-to-cloud` | Activate only if Laravel Cloud is selected. Use for Cloud environments, resources, secrets, deployment and troubleshooting. |
| `imagegen` | Activate if asked to create new sample or launch imagery. Existing assets and owner-provided media are the implementation inputs. |
| `infer-conventions` | Activate if the user separately requests a conventions audit or shared rules. Use the existing conventions during implementation. |

Before depending on a framework API, verify installed versions again. The planning checkout used PHP 8.2, Laravel 12.73, `inertiajs/inertia-laravel` 2.0.28, `@inertiajs/react` 2.0.3, React 19, Tailwind 4.0.8, Vite 6.1.1 and Pest 3.8.7. Use Laravel Boost `search-docs` first for version-sensitive work. Consult installed code and official versioned documentation if Boost is unavailable. Use the existing Inertia `useForm` pattern and check the installed adapter before adopting examples from newer releases. [Laravel 12 authentication](https://laravel.com/docs/12.x/authentication) · [Inertia v2 forms](https://inertiajs.com/docs/v2/the-basics/forms) · [Inertia v2 file uploads](https://inertiajs.com/docs/v2/the-basics/file-uploads)

## 3. MySQL schema

Add the three application tables below. Use `utf8mb4`. Verify the MySQL version and choose a case-insensitive, accent-insensitive catalogue collation supported by that installation. Preserve the starter's existing infrastructure tables. The admin identity is standalone.

### `admins`

| Column | MySQL type | Rules |
|---|---|---|
| `id` | `BIGINT UNSIGNED` | Primary key, auto-increment |
| `name` | `VARCHAR(255)` | Required |
| `email` | `VARCHAR(255)` | Required, unique, stored trimmed and normalized |
| `password` | `VARCHAR(255)` | Required, Laravel password hash |
| `remember_token` | `VARCHAR(100)` | Nullable, reserved for Laravel remember-me support |
| `created_at` | `TIMESTAMP` | Laravel timestamp |
| `updated_at` | `TIMESTAMP` | Laravel timestamp |

### `listings`

| Column | MySQL type | Rules |
|---|---|---|
| `id` | `BIGINT UNSIGNED` | Primary key, auto-increment. Stable when a title changes |
| `section` | `TINYINT UNSIGNED` | Required. Fixed at creation |
| `title` | `VARCHAR(255)` | Required. Trim and reject whitespace-only input |
| `description` | `TEXT` | Nullable plain text |
| `service_formats` | `TEXT` | Nullable plain text. Digi World only, one example per line |
| `price` | `DECIMAL(10,2)` | Nullable, nonnegative amount in rupees. Blank maps to `NULL` and zero remains zero |
| `media_type` | `TINYINT UNSIGNED` | Nullable. Derived from validated upload |
| `media_path` | `VARCHAR(255)` | Nullable. Generated relative path on the managed disk |
| `media_original_name` | `VARCHAR(255)` | Nullable. Original filename for admin display |
| `media_mime_type` | `VARCHAR(127)` | Nullable. Detected server-side |
| `media_size_bytes` | `INT UNSIGNED` | Nullable. Detected server-side |
| `poster_path` | `VARCHAR(255)` | Nullable. Required for published Media videos |
| `status` | `TINYINT UNSIGNED` | Required. Defaults to `STATUS_HIDDEN` |
| `sort_order` | `INT UNSIGNED` | Required. Assigned by the server within the section |
| `created_at` | `TIMESTAMP` | Laravel timestamp. Used as a sort tie-breaker |
| `updated_at` | `TIMESTAMP` | Laravel timestamp |

Create a composite index on `(section, status, sort_order)`. Public order is `sort_order ASC`, `created_at DESC`, `id ASC`. Use this total order consistently for pagination and catalogue previews. The list rank does not require a uniqueness constraint. Preserve individual records when titles happen to match. [Laravel migration and index reference](https://laravel.com/docs/12.x/migrations#creating-indexes)

### `site_settings`

| Column | MySQL type | Rules |
|---|---|---|
| `id` | `TINYINT UNSIGNED` | Primary key. Use `SITE_SETTINGS_ID` and provision that row once |
| `whatsapp_number` | `VARCHAR(16)` | Required. International country code and number stored as digits |
| `created_at` | `TIMESTAMP` | Laravel timestamp |
| `updated_at` | `TIMESTAMP` | Laravel timestamp |

Repeat provisioning safely. The companion site currently uses `919388002975` as the group WhatsApp number. Confirm it with the owner before production provisioning. An existing owner-edited number takes precedence over the initial contact. The settings endpoint addresses the singleton by its constant and can recover a missing row when the owner saves. The public site omits WhatsApp buttons until a usable setting is present so a missing row never sends customers to the wrong number.

### Constant names and validation

| Column | Named constants | Ownership |
|---|---|---|
| `listings.section` | `SECTION_MEDIA`, `SECTION_CARDS`, `SECTION_BOOKS`, `SECTION_DIGI_WORLD` | Server maps fixed route keys to these constants |
| `listings.media_type` | `MEDIA_IMAGE`, `MEDIA_VIDEO` | Server derives from verified media |
| `listings.status` | `STATUS_HIDDEN`, `STATUS_PUBLISHED` | Server applies the requested action |
| `site_settings.id` | `SITE_SETTINGS_ID` | Server addresses the singleton row |

Keep the integer assignments in a single PHP definition for each domain and retain the assignments after deployment. Use Laravel casts consistent with that choice and validate allowed values at the server boundary. Request actions, filenames, URL slugs, money, timestamps and user-entered text are separate from these stored choices. Give React labelled UI props and stable string keys so it never relies on numeric storage codes. Protect scope, status, disk paths, file metadata and ordering from client mass assignment.

## 4. Screen and listing behaviour

### Owner workflow

1. Open `/admin`. A signed-out owner goes to the admin login and a signed-in owner sees the four business sections.
2. Open the section and choose **Add creative**, **Add card**, **Add book** or **Add service**. The choice on the previous screen selects the section for the form.
3. Fill in the labelled fields and preview the result. An existing entry shows its saved media until the owner selects a replacement.
4. Choose **Save hidden** or **Publish** for a new or hidden entry. On a visible entry, **Save changes** immediately updates the website. A separate **Hide** action takes it down.
5. Return to the section list with a specific success message. Keep the form and relevant error messages visible when saving fails.

| Section | Fields and public rules |
|---|---|
| Kampuram Media | Title, optional description and price, one image or video. Require media to publish. Images and video posters display in the existing 4:3 frame. |
| Cards Kendra | Title, optional description and price, one image. Require an image to publish. Square card frame. Add `per card` in the display only. |
| Kampuram Books | Title, optional **Author or description**, optional price, and one cover. Save the author or description in `description`. Require a cover at least 600px wide to publish and render in the existing 3:4 frame. |
| Kampuram Digi World | Service name, short description, optional **Examples** and optional image. Require the name to save, and the description to publish. Generate an enquiry from the full service name. Keep its public service showcase layout. |

Use the existing layout and components as the base. Borrow Kampuram's off-white background and dark orange accent. Use high-contrast text, a single readable type family for admin screens, and the group logo at sign-in. Keep desktop forms in one left-aligned column and stack thumbnails, details and actions on narrow screens. Use large, visible text buttons and always-visible field labels. Place each error by its field and focus the first error on a failed submission. Keep a visible focus style, an accessible progress/status announcement, and large touch targets. Use text as well as colour for status feedback.

Display thumbnail, title, **Visible** or **Hidden**, **Edit**, **Publish** or **Hide**, and **Move up / Move down**. Use the complete section order for move controls so hidden rows have a defined position when published later. Within Media, offer **All**, **Images**, and **Videos** filters and expose reordering in the full list. Provide **Add** as the empty-list action. Put permanent deletion inside Edit with a confirmation that names the item and labels both **Cancel** and **Delete permanently**. Support keyboard navigation and preserve logical focus when a row changes.

The preview uses the unsaved values and a local object URL for a newly selected file. Revoke object URLs when they are replaced or the form unmounts. Keep the current upload until a replacement succeeds. Disable duplicate submissions during upload and indicate progress after file selection and during save. Use the upload progress and error handling provided by the installed Inertia adapter.

### Validation and publish rules

- Trim text and normalize blank optional inputs. Store plain text. Cap titles at 255 characters, descriptions at 2,000 and Digi World examples at 1,000. Show the relevant limit beside a field when it is exceeded. Preserve line breaks in examples and drop blank lines when rendering. Accept examples on Digi World only, and price on Media, Cards and Books only.
- Accept numeric price input with at most two decimal places and within the database range. Validate the request before converting or saving. Keep decimals exact in PHP serialization and apply the existing public formatting rules at display time.
- Allow JPG, PNG and WebP images up to 5 MiB, and MP4 or WebM videos up to 20 MiB for Media only. Validate image readability, detected file type, size, and section rules server-side. Named upload size and type definitions should also drive form hints. Apply image validation and the image size limit to the supplied poster and require a corresponding video. Verify actual video decoding in the browser preview and staging playback checks.
- Hidden entries can be saved without media. Validate every supplied replacement even on hidden entries. A published entry must continue to pass all publication rules after editing. Validate media presence against the combined existing and new state. An explicit **Remove file** action is available for a saved Digi World image and for the existing media of any hidden item. Visible Media, Cards and Books items can replace a file while visible or hide the item before removing it.
- Detect the file format on the server. Infer type, size and stored path server-side. A Media video replacement needs its own poster; an image replacement clears the old poster after saving. Use browser-side frame capture to make a JPEG poster, with a clearly labelled image-picker fallback when the browser cannot decode the video. Recommend MP4 to the owner and test the supported files on the intended browsers.
- Validate the WhatsApp field as an international digit string. Accept common display separators and an optional leading plus, normalize to digits, and reject unsupported characters or an invalid international length. Show the current number and provide a **Test WhatsApp link** action before save.

## 5. Route and data contract

Use named web routes and controller actions. The section keys in URLs are `media`, `cards`, `books`, and `digi-world`. Resolve these through a fixed server map. Bind edit and write requests to both the listing ID and section. Return a missing-page response for a listing requested under the wrong section. The public and admin media routes resolve files from the listing record and a fixed main/poster choice.

| Method and path | Behaviour |
|---|---|
| `GET /admin/login`, `POST /admin/login` | Show the sign-in form and authenticate with the `admin` guard. Use `guest:admin`. |
| `POST /admin/logout` | Log out of the admin guard and rotate session credentials. |
| `GET /admin` | Show the four business choices and Settings. Use `auth:admin`. |
| `GET /admin/listings/{section}` | Section list, plus media filtering where applicable. |
| `GET /admin/listings/{section}/create` | New-entry form. |
| `POST /admin/listings/{section}` | Create a hidden or published listing. |
| `GET /admin/listings/{section}/{listing}/edit` | Edit form, including existing media metadata and preview. |
| `PATCH /admin/listings/{section}/{listing}` | Save text or replace media. Submit multipart replacements with the Inertia-supported method override. |
| `PATCH /admin/listings/{section}/{listing}/visibility` | Publish or hide after the appropriate validation. |
| `PATCH /admin/listings/{section}/{listing}/position` | Move one position up or down within the full section order. |
| `DELETE /admin/listings/{section}/{listing}` | Permanently delete the confirmed entry and clean up its owned files. |
| `GET /admin/settings`, `PATCH /admin/settings` | Read and update the shared WhatsApp setting. |
| `GET /admin/media/{listing}/{variant}` | Serve an existing file for authenticated admin preview, including hidden entries. |
| `GET /media/{listing}/{variant}` | Serve an existing upload only while the listing is published. |

All admin routes except the two login routes require `auth:admin`. Apply the normal Laravel web middleware, CSRF protection and a throttle on login. If a normal starter `web` account visits the admin, send it through admin login. Scope intended admin redirects to safe admin routes. Regenerate the session on sign-in, invalidate it and regenerate the CSRF token on admin logout, and verify admin access is gone after logout. Normalize the email before credential lookup and use a generic invalid-credentials message. Share only the minimal admin identity on admin Inertia pages and keep its payload distinct from the starter user identity. Keep passwords and auth tokens hidden in model serialization.

Suggested Inertia payloads are section key and label, permitted media, the listing fields needed by the screen, scoped preview URLs, status labels, move availability, list filters or pagination and flash feedback. Public props contain rendered catalogue fields, validated content and public URLs. Construct WhatsApp links with a shared helper and URL-encode the full title or service message. Preserve the current Media enquiry wording and Digi World's service-specific intent. Consume a single shared setting wherever the public site links to WhatsApp.

### Write request fields

| Action | Accepted fields |
|---|---|
| Sign in | `email` and `password`. Keep persistent sign-in out of the initial form. |
| Create | `title`, section-appropriate `description`, `price` or `service_formats`, optional `media` and `poster` file parts, and `intent` for Save hidden or Publish. |
| Edit | Same content fields as Create. An omitted upload retains the saved file. Use `remove_media` where removal is allowed, and reject an upload and a removal in the same request. A save intent preserves the current status. An explicit Publish intent validates the submitted changes and publishes them together. |
| Change visibility | `intent` for Publish or Hide. Load the saved listing and apply the publication checks. |
| Move | `direction` for Up or Down. Resolve the neighbour server-side. |
| Delete | Listing identity comes from the section and listing route parameters. Trigger the request after the named confirmation. |
| Save Settings | `whatsapp_number` only. Normalize before persisting. |

Use Form Requests or the starter's supported validation pattern for the web endpoints. Translate action keys to PHP constants on the server. Return validation errors through Inertia, preserve the owner's non-file inputs when possible, and prompt for reselection if a file cannot be retained. Successful writes return a redirect and one specific flash message, such as **Book published** or **WhatsApp number updated**. An upload rejected by the web server should produce a friendly size-limit message wherever the host lets the app handle the response.

### Proposed implementation locations

| Area | Location in the Laravel project |
|---|---|
| Schema and data | `database/migrations`, `app/Models`, `database/factories`, `database/seeders` |
| Login and guards | `config/auth.php`, `bootstrap/app.php`, admin session controller under `app/Http/Controllers`, and the existing Inertia middleware |
| Routes and requests | `routes/web.php` with an admin route group or an included `routes/admin.php`, and scoped requests under `app/Http/Requests` |
| Catalogue and managed files | Controllers under `app/Http/Controllers`. Extract shared file lifecycle logic only where the write and cleanup flows reuse it. |
| Admin UI | `resources/js/pages/admin`, an admin layout under `resources/js/layouts`, and shared form/list components under `resources/js/components` as needed |
| Public UI | `resources/js/pages` and existing shared components. Put genuinely shared enquiry and formatting logic close to the catalogue code. |
| Operator commands | `app/Console/Commands` for admin provisioning and assisted password reset |
| Tests | Focused Pest feature files under `tests/Feature`, with small unit tests only when a helper has behaviour worth testing separately |

## 6. Upload, replacement, visibility and deletion

Use one configured private disk on durable storage. Keep immutable design assets with the public project assets. Store uploads under an owned, generated path for each upload, with extensions chosen from the allowed server-verified types. Original names are display metadata. Serve uploads by record lookup, with content-type and range support for videos. Keep upload directories outside the public web root. Return a missing-file response when an item is hidden, deleted or missing its file, except that authenticated admin previews can open hidden entries. Set response cache behaviour so a new request after Hide cannot receive a stale public file. [Laravel 12 file storage](https://laravel.com/docs/12.x/filesystem)

| Operation | Sequence and failure handling |
|---|---|
| Create | Validate all inputs. Write the new upload and poster. Check that storage succeeded before inserting the row. On failure, keep the form usable and clean up any newly written files. |
| Replace | Validate and write replacement files to new paths. Lock and reload the listing while applying the change and validating its resulting state. Save the new paths in the DB, then remove old owned paths after commit. On rollback or if a concurrent delete removed the listing, remove the new unreferenced uploads. A failed replacement leaves any surviving listing and its prior files available. |
| Remove file | Check removal eligibility on the locked row. Clear the media type, path, original name, MIME type, size and poster together. Remove the previously referenced files after commit. |
| Publish | Validate the current listing and check that its required media files exist under the row lock. When publishing from a form with edits, validate the complete proposed state. Reject an invalid transition with a clear field error. |
| Hide | Change status immediately. Keep uploads on private storage for future publication and admin previews. |
| Delete | Confirm by title in the admin. Remove the database record first, then clean up its owned paths after commit. A repeated delete must leave the same effective result. |
| Cleanup failure | Report the storage error without exposing paths to the owner. Keep the committed catalogue state, record the unused path for cleanup, and provide a maintenance procedure that verifies a path has no remaining references before removing it. |

Take the same row lock for Save changes, Publish, Hide and Delete. Determine required media from the status held by the locked row plus the current request's explicit action. If Hide wins first, a normal save preserves hidden status. If Publish wins first, a replacement or removal must leave media that meets the public requirements. Keep file writes outside retryable database transactions, and schedule cleanup only for paths from the committed mutation. Never take a deletion path from request data. Restrict deletion to the application's managed namespace and verify that no other listing references a candidate path. On a replacement or delete race, use the current locked record to identify the old files. Simulate both write and cleanup failures in the targeted tests where the outcome differs.

For ordering, append new entries to the section. On Move up or down, lock the relevant section rows in a consistent order, select the neighbour from the full ordered list and persist the change in one transaction. If equal ranks make a swap ambiguous, normalize the ranks for that section inside the transaction. Concurrent equal ranks still have deterministic ordering through the public tie-breakers. The first and last rows disable the unavailable move. Other sections keep their order.

## 7. Public catalogue integration

- Keep Home, Media, Cards Kendra, Books, Digi World and Contact available. Use named routes. Prefer their existing public paths where practical. If canonical paths change, redirect each legacy `.html` path and preserve useful query parameters such as search and media filter. Point the nav, footer and Home business links to the live routes.
- Reuse shared header, footer, contact and catalogue components where the artwork and behaviour match. Retain the distinct section logos and crops. Use the primary app as the source of data after cutover.
- Media, Cards and Books keep title/description search with case and accent insensitivity and all terms matching. Media also keeps **All / Images / Videos** and counts based on the search result before type filtering. Keep `q` and `filter` in the URL, support refresh and Back/Forward, debounce typing, and reset the result count on a filter or search change. Escape user wildcard characters for literal substring matching and use bound query values. Verify the behaviour on MySQL.
- Show public listings in the defined order. Keep **Load more** in batches of 12 for Media, Cards and Books. Apply section, publication, search and type rules before paginating and before computing counts as applicable. Give a useful empty state and a clear search reset. Avoid repeating cards when appending more results for the current filter.
- Preserve the compact prices. A whole price displays without decimals, fractional prices show two decimal places, and Cards Kendra appends `per card`. A blank price has no line. Use the full title in the existing Media message, `Hi, I am interested in: {title}`. Start a Media video only on an explicit Play action, pause a previous video when another starts, and release playback when filtering removes its card.
- Pull Digi World's visible services and example bullets from its section. Keep the separate portfolio examples and FAQs as page content. Use one shared WhatsApp number for service cards, catalogue entries, the group contact links and floating controls. Keep `tel:` numbers and other contact details as their existing page content.
- Load approved images, covers and services in a deliberate initial order. Keep the original design assets distinct from listing uploads. Verify approved content, rights, prices and phone details before public cutover.

## 8. Implementation tasks in order

Check off each task only when its exit condition holds. Start the next independent phase when its prerequisites are present.

### Phase A. Baseline and MySQL

Skills `laravel-best-practices`, `testing-best-practices`.

- [ ] Read project rules, sibling implementations, current migrations, starter auth routes, Inertia middleware and test configuration. Verify package versions with Composer and the npm lockfile. Capture the baseline route list and run the starter tests.
- [ ] Confirm the PHP runtime and PDO MySQL driver, database version, charset and collation. Set up a local MySQL database and separate scratch database for migration and behaviour checks. Keep credentials out of tracked files. Confirm the active connection by using read-only schema inspection.
- [ ] Confirm the production storage and database approach before hosting changes. The local implementation can proceed before a host is selected.

**Exit condition** The starter boots, the local app can connect to MySQL, and the test database is isolated from owner data.

### Phase B. Tables, models and initial configuration

Skills `laravel-best-practices`, `testing-best-practices`.

- [ ] Create migrations for `admins`, `listings` and `site_settings` with Artisan after implementation is authorized. Implement the constant definitions before using them as defaults. Inspect the resulting MySQL column types, nullable fields, index and constraints with Boost schema tools or read-only Artisan inspection.
- [ ] Create `Admin`, `Listing`, and `SiteSetting` models. Add the required starter-compatible factories and seeders. Use named factory states for hidden, published and relevant sections. Keep actual credentials out of seeders, fixtures and logs.
- [ ] Add repeatable settings provisioning. Use a test fixture phone number in local automated checks. Set the confirmed group WhatsApp contact during approved production provisioning. Keep illustrative catalogue data for a development seeding path and stage approved launch content separately.
- [ ] Verify fresh migration, a rollback of the new migrations on the scratch database, and a fresh re-run. Test blank, zero and decimal prices against the actual schema.

**Exit condition** The MySQL schema matches section 3 and a second settings seed preserves the owner's saved number.

### Phase C. Admin sign-in and shell

Skills `laravel-best-practices`, `inertia-react-development`, `frontend-design`, `tailwindcss-development`, `testing-best-practices`.

- [ ] Add the `admin` guard and `admins` provider. Create admin-specific session actions and guest redirects. Reuse suitable auth form components without reusing the user provider. Remove the starter registration entry points and public starter auth links for catalogue release. Check any affected starter routes and update their relevant tests without deleting tests.
- [ ] Add operator-only provisioning and password-reset commands with hidden password prompts, Laravel hashing and clear feedback. Keep version one recovery operator-assisted. Rotate the remember token on reset. If remember-me is enabled later, test it separately and use an explicit session-revocation strategy for account recovery that needs to revoke active sign-ins.
- [ ] Implement admin navigation, section labels, Settings and Sign out. Confirm only the admin guard opens protected routes. Test ordinary user-session isolation, including a starter user with the same email.

**Exit condition** The provisioned owner can sign in, see the four sections, sign out, and recover access through the documented operator procedure.

### Phase D. Listing management, uploads and ordering

Skills `laravel-best-practices`, `inertia-react-development`, `frontend-design`, `tailwindcss-development`, `testing-best-practices`.

- [ ] Create the shared section list, empty state and reusable form. Implement section-specific fields, admin previews, step-by-step labels and status messages. Start with an image listing and verify the full save-to-publish path.
- [ ] Add Media video selection, poster capture and manual fallback. Verify replacement and preview for each file combination. Handle oversized requests at the app and hosting boundary. Ensure the PHP request limit allows the video, poster and multipart overhead.
- [ ] Implement and test Publish, Hide, Save changes, Move up, Move down and confirmed Delete. Check safe storage cleanup, cross-section paths, filtered list navigation and concurrent file replacement semantics.

**Exit condition** The owner can create and manage one realistic entry in each section, and file changes behave as specified in section 6.

### Phase E. Settings and public cutover wiring

Skills `laravel-best-practices`, `inertia-react-development`, `frontend-design`, `tailwindcss-development`, `testing-best-practices`.

- [ ] Build the one-field WhatsApp settings screen. Add validation, the test link, save feedback and the shared public settings read. Ensure update takes effect on the next public visit without a rebuild.
- [ ] Connect the six public pages, live catalogue queries, media routes, search, filters, ordering, pagination and enquiry links. Check URL history, legacy links and visible layout against the companion static pages.
- [ ] Stage approved content and review titles, spelling, image crop, rupee prices, example bullets and each enquiry link. Check that hiding a public listing also blocks new requests for both its upload variants.

**Exit condition** Every public section displays only its visible entries, every WhatsApp link reads the same setting, and existing visitor flows work with live data.

### Phase F. Verification and release

Skills `testing-best-practices`, `laravel-best-practices`, `computer-use:computer-use` when needed, and `deploying-to-cloud` only if Laravel Cloud is selected.

- [ ] Run the affected Pest feature files, then the full suite. Run targeted checks against a scratch MySQL instance for collations, decimal persistence, MySQL schema types and ordering. Format PHP with `vendor/bin/pint --dirty --format agent` per project rules. Run the TypeScript checks, check formatting of touched frontend files and run `npm run build`.
- [ ] On staging, smoke-test actual uploads at the intended limits, range playback, owner actions, public parity and recovery. Back up the database and upload directory together. Practise restoration against a scratch environment before launch.
- [ ] Prepare the hosting environment with HTTPS, production environment settings, a private durable upload directory, correct PHP and request limits, database credentials and a deployment backup. Apply approved migrations, compile assets, provision the owner, and load the approved catalogue. Smoke-test the live site and owner login after release authorization.
- [ ] Walk the owner through **Add**, **Preview**, **Publish**, **Hide**, **Edit** and **Change WhatsApp number** on their own device. Record who handles access recovery and backups.

**Exit condition** Launch checks pass, the owner completes one full catalogue edit, and the operator can recover the account and restore the site.

### Local verification commands

Run these during implementation from the primary Laravel folder. Replace the feature filter with the actual changed feature name. Check which database configuration is active before any migration command, and verify the active frontend toolchain before running the build.

```powershell
composer show --direct
php artisan db:show --no-interaction
php artisan route:list --except-vendor --no-interaction
php artisan test --compact --filter=AdminListing --no-interaction
php artisan test --compact --no-interaction
vendor/bin/pint --dirty --format agent
npx --no-install tsc --noEmit
npm run build
```

## 9. Test matrix and acceptance checks

Use existing Pest conventions. Cover the changed behaviour through the real web routes and assert both the response and saved state. Use factories for users, admins and listings and fake only external boundaries such as file storage where useful. Use real small image/video fixtures for content detection, poster playback and browser checks. Run production-engine checks where the SQLite test configuration cannot prove MySQL behaviour. [Laravel 12 HTTP tests](https://laravel.com/docs/12.x/http-tests)

| Area | Automated acceptance | Manual or production-engine check |
|---|---|---|
| Guard and credentials | Admin sign-in and logout work. Guest and starter-user sessions cannot read or mutate admin data. Wrong credentials and login throttling have expected outcomes. Same email in both identity stores stays isolated. | Sign in and out on the owner's browser and rehearse an operator-assisted reset. |
| Listing writes | Four sections save expected fields. Route scope wins over client input. Wrong section, unexpected option, invalid amount, and missing publish requirements are rejected. Confirm optional fields, zero prices and model state. | Complete one create, publish, edit and hide flow in each section. |
| Upload and poster | Reject unsupported, oversize, mismatched and wrong-section files and unreadable images. Use server metadata. Require a poster to publish a video. Cover retention and cleanup for replacement, removal, delete and save failure. | Choose, preview and play a representative MP4 and WebM. Check unreadable video feedback, poster capture and fallback, and try the upload boundary on staging. |
| Simultaneous actions | Verify a staged replacement losing to Delete leaves no referenced upload or staged file. Verify that Publish validates the current media and that a plain Save changes preserves a preceding Hide. | Reproduce the action order with two admin tabs and confirm final visibility and preview represent the saved state. |
| Visibility and delivery | Guests can load published assets only. Hidden, deleted, missing and wrong variants fail. Admin preview can load hidden uploads. Public listing and Home data contain visible rows only. | Verify a new visit after Hide, video range responses, and mobile playback behaviour. |
| Ordering and discovery | Move affects only the intended section, respects boundaries, and keeps deterministic output. Search combines terms, escapes wildcard input and respects filters, counts and pagination. | Test case and accent insensitivity on MySQL. Try search, reset, refresh, Back and Load more on the live pages. |
| Settings and enquiries | A settings update affects every public WhatsApp link. Invalid numbers preserve the previous setting. Public links encode full names and titles. | Open enquiry links to confirm the displayed recipient and message, without sending a message. |
| Owner experience | Verify validation feedback at the form boundary and expected redirects and messages. | Use keyboard and phone to check readable labels, visible focus, touch controls, upload progress, confirmation, empty states and layouts without horizontal overflow. |
| Recovery | Verify reproducible schema and seed behaviour on scratch MySQL. | Restore the DB and private files together and open catalogue items and admin previews from the restored copy. |

## 10. Release inputs and maintenance

| Input | Needed by |
|---|---|
| Owner name and email, access to a secure credential handoff channel and an operator contact | Admin account provisioning and handover |
| Approved catalogue titles, descriptions, prices, images, videos and Digi World service examples | Content staging and owner review |
| Confirmed shared WhatsApp destination and any public contact edits | Public link verification before launch |
| Host, domain, HTTPS, MySQL access, persistent private storage and enough disk space for uploads and backups | Staging and deployment |
| Backup owner and location, retention schedule and restore rehearsal | Production readiness |

Keep a database backup and a matching copy of private uploads on a recoverable schedule. Before cutover, preserve the current release and take a coordinated backup. If the deployment must be reversed, prefer reverting application code with the new data intact when compatible. Restoring the coordinated backup is a separate operation that needs authorization because it can discard changes since the backup. Check the homepage, a published asset, owner access and WhatsApp links after a rollback or restore.

For ordinary content changes, the owner uses the admin. The operator handles account recovery, hosting, backup verification, and logged orphan-file cleanup. The implementation is complete when the owner can maintain all four sections and change the shared number without a developer, the public site reflects those changes, and the release checklist is verified.
