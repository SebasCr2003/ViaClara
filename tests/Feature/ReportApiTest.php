<?php
namespace Tests\Feature;

use App\Models\User;
use App\Models\Report;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReportApiTest extends TestCase
{
    use RefreshDatabase;

    private function payload():array {
        return [
            'title'=>'Hueco profundo frente a parque',
            'type'=>'Hueco o bache','severity'=>'Alta',
            'sector'=>'Centro','address'=>'Carrera 11 # 11-20',
            'description'=>'Reporte de prueba que permite verificar el formulario.',
            'lat'=>1.61549,'lng'=>-75.60412,'photo'=>'',
        ];
    }

    public function test_requiere_autenticacion():void {
        $this->get('/api/reportes')->assertRedirect('/ingresar');
    }

    public function test_crea_edita_actualiza_estado_y_elimina_reporte():void {
        $user=User::create(['name'=>'Admin QA','email'=>'test@example.com','password'=>'ClaveTemporalDoce!']);
        $this->actingAs($user);
        $response=$this->postJson('/api/reportes',$this->payload())->assertCreated()
           ->assertJsonPath('report.status','Pendiente');
        $id=$response->json('report.id');
        $this->assertDatabaseHas('reports',['id'=>$id,'title'=>'Hueco profundo frente a parque']);
        $this->putJson('/api/reportes/'.$id,array_merge($this->payload(),['title'=>'Bache corregido desde pruebas']))
           ->assertOk()->assertJsonPath('report.title','Bache corregido desde pruebas');
        $this->patchJson('/api/reportes/'.$id.'/estado',['status'=>'En revisión'])
           ->assertOk()->assertJsonPath('report.status','En revisión');
        $this->assertCount(3,Report::findOrFail($id)->history);
        $this->getJson('/api/reportes')->assertOk()->assertJsonCount(1,'reports');
        $this->deleteJson('/api/reportes/'.$id)->assertOk();
        $this->assertDatabaseMissing('reports',['id'=>$id]);
    }

    public function test_rechaza_datos_incorrectos():void {
        $user=User::create(['name'=>'Admin QA','email'=>'test@example.com','password'=>'ClaveTemporalDoce!']);
        $this->actingAs($user);
        $this->postJson('/api/reportes',array_merge($this->payload(),['lat'=>95,'description'=>'corta']))
           ->assertUnprocessable()->assertJsonValidationErrors(['lat','description']);
        $this->assertDatabaseCount('reports',0);
    }
}
