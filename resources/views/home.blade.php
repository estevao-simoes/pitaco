<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="author" content="Estevão Simões">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Jogo de palavras. Inspirado pelo termo ooo. O wordle em portuges">

    <title>
        Pitaco do dia - Wordle Brasileiro
    </title>

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

<body
    class="antialiased relative flex flex-col items-top justify-center min-h-screen bg-gray-100 dark:bg-gray-900 sm:items-center py-4 sm:pt-0"
    x-data="{'isModalOpen': false}" x-on:keydown.escape="isModalOpen=false">

    <header>

        <button x-on:click="isModalOpen = true" class="text-gray-900 dark:text-white text-3xl font-black right-6 top-0 mr-8 mt-4 absolute">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.25 12C19.25 16.0041 16.0041 19.25 12 19.25C7.99594 19.25 4.75 16.0041 4.75 12C4.75 7.99594 7.99594 4.75 12 4.75C16.0041 4.75 19.25 7.99594 19.25 12Z"></path>
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 10C9.75 10 10 7.75 12 7.75C14 7.75 14.25 9 14.25 10C14.25 10.7513 13.8266 11.5027 12.9798 11.8299C12.4647 12.0289 12 12.4477 12 13V13.25"></path>
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M12.5 16C12.5 16.2761 12.2761 16.5 12 16.5C11.7239 16.5 11.5 16.2761 11.5 16C11.5 15.7239 11.7239 15.5 12 15.5C12.2761 15.5 12.5 15.7239 12.5 16Z"></path>
            </svg>
        </button>
        {{-- <button x-on:click="isModalOpen = true" class="text-gray-900 dark:text-white text-3xl font-black right-0 top-0 mr-8 mt-4 absolute">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.1191 5.61336C13.0508 5.11856 12.6279 4.75 12.1285 4.75H11.8715C11.3721 4.75 10.9492 5.11856 10.8809 5.61336L10.7938 6.24511C10.7382 6.64815 10.4403 6.96897 10.0622 7.11922C10.006 7.14156 9.95021 7.16484 9.89497 7.18905C9.52217 7.3524 9.08438 7.3384 8.75876 7.09419L8.45119 6.86351C8.05307 6.56492 7.49597 6.60451 7.14408 6.9564L6.95641 7.14408C6.60452 7.49597 6.56492 8.05306 6.86351 8.45118L7.09419 8.75876C7.33841 9.08437 7.3524 9.52216 7.18905 9.89497C7.16484 9.95021 7.14156 10.006 7.11922 10.0622C6.96897 10.4403 6.64815 10.7382 6.24511 10.7938L5.61336 10.8809C5.11856 10.9492 4.75 11.372 4.75 11.8715V12.1285C4.75 12.6279 5.11856 13.0508 5.61336 13.1191L6.24511 13.2062C6.64815 13.2618 6.96897 13.5597 7.11922 13.9378C7.14156 13.994 7.16484 14.0498 7.18905 14.105C7.3524 14.4778 7.3384 14.9156 7.09419 15.2412L6.86351 15.5488C6.56492 15.9469 6.60451 16.504 6.9564 16.8559L7.14408 17.0436C7.49597 17.3955 8.05306 17.4351 8.45118 17.1365L8.75876 16.9058C9.08437 16.6616 9.52216 16.6476 9.89496 16.811C9.95021 16.8352 10.006 16.8584 10.0622 16.8808C10.4403 17.031 10.7382 17.3519 10.7938 17.7549L10.8809 18.3866C10.9492 18.8814 11.3721 19.25 11.8715 19.25H12.1285C12.6279 19.25 13.0508 18.8814 13.1191 18.3866L13.2062 17.7549C13.2618 17.3519 13.5597 17.031 13.9378 16.8808C13.994 16.8584 14.0498 16.8352 14.105 16.8109C14.4778 16.6476 14.9156 16.6616 15.2412 16.9058L15.5488 17.1365C15.9469 17.4351 16.504 17.3955 16.8559 17.0436L17.0436 16.8559C17.3955 16.504 17.4351 15.9469 17.1365 15.5488L16.9058 15.2412C16.6616 14.9156 16.6476 14.4778 16.811 14.105C16.8352 14.0498 16.8584 13.994 16.8808 13.9378C17.031 13.5597 17.3519 13.2618 17.7549 13.2062L18.3866 13.1191C18.8814 13.0508 19.25 12.6279 19.25 12.1285V11.8715C19.25 11.3721 18.8814 10.9492 18.3866 10.8809L17.7549 10.7938C17.3519 10.7382 17.031 10.4403 16.8808 10.0622C16.8584 10.006 16.8352 9.95021 16.8109 9.89496C16.6476 9.52216 16.6616 9.08437 16.9058 8.75875L17.1365 8.4512C17.4351 8.05308 17.3955 7.49599 17.0436 7.1441L16.8559 6.95642C16.504 6.60453 15.9469 6.56494 15.5488 6.86353L15.2412 7.09419C14.9156 7.33841 14.4778 7.3524 14.105 7.18905C14.0498 7.16484 13.994 7.14156 13.9378 7.11922C13.5597 6.96897 13.2618 6.64815 13.2062 6.24511L13.1191 5.61336Z"></path>
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.25 12C13.25 12.6904 12.6904 13.25 12 13.25C11.3096 13.25 10.75 12.6904 10.75 12C10.75 11.3096 11.3096 10.75 12 10.75C12.6904 10.75 13.25 11.3096 13.25 12Z"></path>
            </svg>
        </button> --}}

        <h1 class="hidden">
            Jogo de palavras brasileiro inspirado no wordle
        </h1>

        <div class="flex justify-center">
            <h2 class="text-gray-900 dark:text-white text-3xl font-black">
                Pitaco
            </h2>
        </div>
    </header>

    <main>
        <div class="max-w-6xl mx-auto sm:px-6 lg:px-8">

            <div class="mt-8">
                @foreach ($word_board['rows'] as $row)
                    <div class="board-row flex justify-center items-center" id="{{ 'row-' . $loop->iteration }}">
                        @foreach ($word_board['columns'] as $column)
                            <div class="flex justify-center items-center border border-gray-500 text-gray-500 dark:border-gray-50 w-16 h-16 m-0.5 dark:text-gray-300 font-extrabold text-2xl uppercase"
                                data-column="{{ $column }}" data-row="{{ $row }}"></div>
                        @endforeach
                    </div>
                @endforeach
            </div>

        </div>
        <div id="keyboard" class="pt-8">

            @foreach ($keyboard as $keyboard_row_index => $keyboard_row)
                <div class="row flex justify-center items-center">
                    @foreach ($keyboard_row as $key_index => $key)
                        <div class="key flex justify-center items-center {{ in_array($key_index, [0, 8]) && $keyboard_row_index == 2 ? 'w-20' : 'w-10' }} h-12 text-gray-500 border border-gray-400 dark:border-gray-300 dark:text-gray-300 rounded m-1 hover:bg-slate-600 hover:text-white hover:cursor-pointer"
                            data-key="{{ $key }}">
                            <span>
                                {!! $key !!}
                            </span>
                        </div>
                    @endforeach
                </div>
            @endforeach
        </div>
        <div class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true"
            tabindex="-1" x-show="isModalOpen" x-on:click.away="isModalOpen = false" x-cloak>
            <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">

                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" x-cloak aria-hidden="true">
                </div>

                <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div
                    class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div class="sm:flex sm:items-start">
                            <div class="mt-3 ml-4 text-left">
                                <p class="text-md leading-6 font-medium text-gray-900">
                                    Descubra a palavra certa em 6 tentativas. Depois de cada tentativa, as peças mostram
                                    o quão perto você está da solução.
                                </p>
                                <hr class="my-4">
                                <div class="flex justify-center items-center my-4">
                                    <div class="flex justify-center items-center border border-gray-500 text-gray-500 dark:border-gray-50 w-10 h-10 m-0.5 dark:text-gray-300 font-extrabold text-2xl uppercase"
                                        data-column="1" data-row="1"
                                        style="background-color: rgb(120, 53, 15); color: white;">z</div>
                                    <div class="flex justify-center items-center border border-gray-500 text-gray-500 dark:border-gray-50 w-10 h-10 m-0.5 dark:text-gray-300 font-extrabold text-2xl uppercase"
                                        data-column="2" data-row="1"
                                        style="background-color: rgb(31, 41, 55); color: white;">e</div>
                                    <div class="flex justify-center items-center border border-gray-500 text-gray-500 dark:border-gray-50 w-10 h-10 m-0.5 dark:text-gray-300 font-extrabold text-2xl uppercase"
                                        data-column="3" data-row="1"
                                        style="background-color: rgb(21, 128, 61); color: white;">b</div>
                                    <div class="flex justify-center items-center border border-gray-500 text-gray-500 dark:border-gray-50 w-10 h-10 m-0.5 dark:text-gray-300 font-extrabold text-2xl uppercase"
                                        data-column="4" data-row="1"
                                        style="background-color: rgb(31, 41, 55); color: white;">r</div>
                                    <div class="flex justify-center items-center border border-gray-500 text-gray-500 dark:border-gray-50 w-10 h-10 m-0.5 dark:text-gray-300 font-extrabold text-2xl uppercase"
                                        data-column="5" data-row="1"
                                        style="background-color: rgb(31, 41, 55); color: white;">a</div>
                                </div>
                                
                                <p class="text-md leading-6 font-medium text-gray-900 mt-2">

                                    <div class="inline-flex justify-center items-center border border-gray-500 text-gray-500 dark:border-gray-50 w-10 h-10 m-0.5 dark:text-gray-300 font-extrabold text-2xl uppercase"
                                        data-column="3" data-row="1"
                                        style="background-color: rgb(21, 128, 61); color: white;">b</div> faz parte da palavra e está na posição correta.
                                </p>
                                <p class="text-md leading-6 font-medium text-gray-900 mt-2">
                                <div class="inline-flex justify-center items-center border border-gray-500 text-gray-500 dark:border-gray-50 w-10 h-10 m-0.5 dark:text-gray-300 font-extrabold text-2xl uppercase"
                                    data-column="3" data-row="1"
                                    style="background-color: rgb(120, 53, 15); color: white;">z</div> faz parte da
                                palavra mas em outra posição.
                                </p>
                                <p class="text-md leading-6 font-medium text-gray-900 mt-2">
                                <div class="inline-flex justify-center items-center border border-gray-500 text-gray-500 dark:border-gray-50 w-10 h-10 m-0.5 dark:text-gray-300 font-extrabold text-2xl uppercase"
                                    data-column="3" data-row="1"
                                    style="background-color: rgb(31, 41, 55); color: white;">e</div> não faz parte da palavra.
                                </p>
                                <div class="mt-8">
                                    <p class="text-sm text-gray-500">
                                        Os acentos são preenchidos automaticamente, e não são considerados nas dicas.
                                        <br>
                                        As palavras podem possuir letras repetidas.
                                    </p>
                                </div>

                                <hr class="my-4">

                                <div class="text-gray-700 w-full text-center">
                                    Próxima Palavra em <div id="countdown"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                            type="button" x-on:click="isModalOpen=false">
                            Fechar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <footer>

    </footer>
</body>

</html>
