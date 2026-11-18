<?php

use Illuminate\Support\Facades\Artisan;

Artisan::command('viaclara:estado', function () {
    $this->info('VíaClara - Aplicación académica, Sprint 3.');
})->purpose('Consulta el estado del proyecto VíaClara');
