<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class CreateAdminCommand extends Command
{
    protected $signature = 'viaclara:admin';
    protected $description = 'Crea o actualiza un usuario administrador local';

    public function handle(): int
    {
        $email = trim((string) $this->ask('Correo del administrador', 'admin@viaclara.local'));
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->error('El correo no tiene un formato válido.');
            return self::FAILURE;
        }
        $password = (string) $this->secret('Contraseña (mínimo 12 caracteres)');
        if (mb_strlen($password) < 12) {
            $this->error('La contraseña debe tener al menos 12 caracteres.');
            return self::FAILURE;
        }
        User::updateOrCreate(
            ['email'=>$email],
            ['name'=>'Administrador VíaClara','password'=>Hash::make($password)]
        );
        $this->info('Administrador configurado. Guarda la contraseña en un lugar seguro.');
        return self::SUCCESS;
    }
}
