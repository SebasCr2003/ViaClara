<?php

namespace Tests\Feature;

use App\Models\Report;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Verificaciones adicionales del flujo real del backend Laravel.
 * Se ejecutan en SQLite :memory: segun phpunit.xml; NO utilizan la BD de la app.
 */
class ViaClaraValidacionTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::create([
            'name' => 'Administracion QA',
            'email' => 'qa@example.test',
            'password' => 'ClaveQAsegura123!',
        ]);
    }

    private function payload(): array
    {
        return [
            'title' => 'Bache de prueba automatica',
            'type' => 'Hueco o bache',
            'severity' => 'Alta',
            'sector' => 'Centro',
            'address' => 'Calle de ejemplo en Florencia',
            'description' => 'Registro ficticio creado solo para verificar la plataforma.',
            'lat' => 1.61549,
            'lng' => -75.60412,
            'photo' => '',
        ];
    }

    public function test_01_invitado_no_puede_ver_panel_ni_reportes(): void
    {
        $this->get('/ingresar')->assertOk()->assertSee('VíaClara');
        $this->get('/')->assertRedirect('/ingresar');
        $this->get('/api/reportes')->assertRedirect('/ingresar');
    }

    public function test_02_usuario_administrador_puede_iniciar_y_cerrar_sesion(): void
    {
        $this->admin();
        $this->post('/ingresar', [
            'email' => 'qa@example.test',
            'password' => 'ClaveQAsegura123!',
        ])->assertRedirect('/');
        $this->assertAuthenticated();
        $this->get('/')->assertOk()->assertSee('Mapa de afectaciones');
        $this->post('/salir')->assertRedirect('/ingresar');
        $this->assertGuest();
    }

    public function test_03_reporte_persiste_en_sqlite_y_aparece_en_consulta(): void
    {
        $this->actingAs($this->admin());
        $response = $this->postJson('/api/reportes', $this->payload())
            ->assertCreated()->assertJsonPath('report.status', 'Pendiente');
        $id = $response->json('report.id');
        $this->assertMatchesRegularExpression('/^AV-[A-Z0-9]{12}$/', $id);
        $this->assertDatabaseHas('reports', ['id' => $id, 'title' => $this->payload()['title']]);
        $this->getJson('/api/reportes')->assertOk()
            ->assertJsonCount(1, 'reports')
            ->assertJsonPath('reports.0.id', $id);
        $this->assertCount(1, Report::findOrFail($id)->history);
    }

    public function test_04_edicion_y_cambio_de_estado_conservan_historial(): void
    {
        $this->actingAs($this->admin());
        $id = $this->postJson('/api/reportes', $this->payload())->assertCreated()->json('report.id');
        $this->putJson('/api/reportes/'.$id, array_merge($this->payload(), [
            'title' => 'Bache de prueba editado',
        ]))->assertOk()->assertJsonPath('report.title', 'Bache de prueba editado');
        $this->patchJson('/api/reportes/'.$id.'/estado', ['status' => 'En revisión'])
            ->assertOk()->assertJsonPath('report.status', 'En revisión');
        $this->patchJson('/api/reportes/'.$id.'/estado', ['status' => 'En revisión'])
            ->assertOk();
        $this->assertCount(3, Report::findOrFail($id)->history);
        $this->assertDatabaseHas('reports', ['id' => $id, 'status' => 'En revisión']);
    }

    public function test_05_datos_invalidos_se_rechazan_sin_guardarse(): void
    {
        $this->actingAs($this->admin());
        $this->postJson('/api/reportes', array_merge($this->payload(), [
            'lat' => 100,
            'lng' => -200,
            'description' => 'Breve',
        ]))->assertUnprocessable()->assertJsonValidationErrors(['lat', 'lng', 'description']);
        $this->assertDatabaseCount('reports', 0);
        $id = $this->postJson('/api/reportes', $this->payload())->assertCreated()->json('report.id');
        $this->patchJson('/api/reportes/'.$id.'/estado', ['status' => 'Inventado'])
            ->assertUnprocessable()->assertJsonValidationErrors('status');
        $this->assertDatabaseHas('reports', ['id' => $id, 'status' => 'Pendiente']);
    }

    public function test_06_eliminacion_borra_reporte_registrado(): void
    {
        $this->actingAs($this->admin());
        $id = $this->postJson('/api/reportes', $this->payload())->assertCreated()->json('report.id');
        $this->deleteJson('/api/reportes/'.$id)->assertOk()->assertJsonPath('deleted', true);
        $this->assertDatabaseMissing('reports', ['id' => $id]);
        $this->getJson('/api/reportes')->assertOk()->assertJsonCount(0, 'reports');
    }

    public function test_07_importacion_de_respaldo_valido_reemplaza_registros_solo_en_bd_temporal(): void
    {
        $this->actingAs($this->admin());
        $this->postJson('/api/reportes', $this->payload())->assertCreated();
        $this->postJson('/api/reportes/importar', [
            'format' => 'viaclara-backup-v1',
            'reports' => [array_merge($this->payload(), [
                'id' => 'AV-PRUEBA-IMPORT',
                'status' => 'Atendido',
                'demo' => true,
                'createdAt' => '2026-11-18T09:30:00-05:00',
                'history' => [],
            ])],
        ])->assertOk()->assertJsonCount(1, 'reports');
        $this->assertDatabaseCount('reports', 1);
        $this->assertDatabaseHas('reports', ['id' => 'AV-PRUEBA-IMPORT', 'status' => 'Atendido']);
    }

    public function test_08_respaldo_incorrecto_no_borra_los_registros(): void
    {
        $this->actingAs($this->admin());
        $id = $this->postJson('/api/reportes', $this->payload())->assertCreated()->json('report.id');
        $this->postJson('/api/reportes/importar', [
            'format' => 'formato-no-permitido',
            'reports' => [],
        ])->assertUnprocessable()->assertJsonValidationErrors('format');
        $this->assertDatabaseHas('reports', ['id' => $id]);
    }
}
