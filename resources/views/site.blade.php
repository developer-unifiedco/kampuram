<!doctype html>
<html lang="en">
    @php($sitePage = $page['props']['sitePage'])
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta inertia="theme-color" name="theme-color" content="{{ $sitePage['themeColor'] }}">
        <meta inertia="description" name="description" content="{{ $sitePage['description'] }}">
        <title inertia>{{ $sitePage['title'] }}</title>
        <link inertia="site-icon" rel="icon" type="image/png" sizes="64x64" href="{{ asset('kampuram-site/'.$sitePage['icon']) }}">
        <link rel="stylesheet" href="{{ asset('kampuram-site/styles.css?v=20261112-3') }}">
        @foreach ($sitePage['styles'] as $style)
            <link inertia="{{ $style }}" rel="stylesheet" href="{{ asset('kampuram-site/'.$style) }}">
        @endforeach
        @viteReactRefresh
        @vite('resources/js/site.tsx')
        @inertiaHead
    </head>
    <body class="{{ $sitePage['bodyClass'] }}">
        @inertia
    </body>
</html>
