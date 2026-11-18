<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('reports', function (Blueprint $table) {
            $table->string('id',80)->primary();
            $table->string('title',90);
            $table->string('type',40);
            $table->string('severity',10);
            $table->string('sector',70);
            $table->string('address',120);
            $table->text('description');
            $table->decimal('lat',10,7);
            $table->decimal('lng',11,7);
            $table->string('status',20)->default('Pendiente');
            $table->longText('photo')->nullable();
            $table->boolean('demo')->default(false);
            $table->json('history')->nullable();
            $table->timestamps();
            $table->index(['status','created_at']);
        });
    }
    public function down(): void { Schema::dropIfExists('reports'); }
};
