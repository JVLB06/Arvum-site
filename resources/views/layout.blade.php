<!DOCTYPE html>
<html lang="pt">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="{{ asset('estilos/' . $__env->yieldContent('style')) }}">
        <title>@yield('title')</title>
    </head>
    <body>
        @yield('content')
    </body>
</html>