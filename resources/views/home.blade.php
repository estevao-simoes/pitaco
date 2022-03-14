<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Laravel</title>

        <!-- Fonts -->
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">

        <script src="//unpkg.com/alpinejs" defer></script>
        
        <script src="{{ asset('js/app.js') }}"></script>

        <link rel="stylesheet" href="{{ asset('css/app.css') }}">

        <style>
            body {
                font-family: 'Nunito', sans-serif;
            }
        </style>
    </head>
    <body class="antialiased">
        <div class="relative flex items-top justify-center min-h-screen bg-gray-100 dark:bg-gray-900 sm:items-center py-4 sm:pt-0" style="flex-direction: column">

            <div class="max-w-6xl mx-auto sm:px-6 lg:px-8">
                <div class="flex justify-center">
                    <h2 class="text-gray-900 dark:text-white text-3xl uppercase mt-8">
                        Palavrinhas
                    </h2>
                </div>

                <div class="mt-8">
                    @foreach ($word_board['rows'] as $row)
                        <div class="board-row flex justify-center items-center">
                            @foreach ($word_board['columns'] as $column)
                                <div class="flex justify-center items-center border border-gray-50 w-16 h-16 m-0.5 text-gray-300 font-extrabold text-2xl uppercase" data-column="{{ $column }}" data-row="{{ $row }}"></div>
                            @endforeach
                        </div>
                    @endforeach
                </div>

            </div>
            <div id="keyboard" class="pt-8">
                
                @foreach ($keyboard as $keyboard_row_index => $keyboard_row)
                    <div class="row flex justify-center items-center">
                        @foreach ($keyboard_row as $key_index => $key)
                            <div class="key flex justify-center items-center {{ (in_array($key_index, [0, 8]) && $keyboard_row_index == 2)  ? 'w-20' : 'w-10'}} h-12 text-gray-500 border border-gray-50 rounded m-1 hover:bg-slate-600 hover:text-white hover:cursor-pointer">
                                <span>
                                    {!! $key !!}
                                </span>
                            </div>
                        @endforeach
                    </div>
                @endforeach
            </div>
        </div>
    </body>
</html>
