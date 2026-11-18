<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class ReportController extends Controller
{
    private const TYPES = ['Hueco o bache','Grieta o fisura','Hundimiento','Inundación','Señalización dañada','Otro'];
    private const SEVERITY = ['Alta','Media','Baja'];
    private const STATUSES = ['Pendiente','En revisión','Atendido'];

    private function rules(): array
    {
        return [
            'title'=>['required','string','min:5','max:90'],
            'type'=>['required',Rule::in(self::TYPES)],
            'severity'=>['required',Rule::in(self::SEVERITY)],
            'sector'=>['required','string','max:70'],
            'address'=>['required','string','max:120'],
            'description'=>['required','string','min:12','max:1000'],
            'lat'=>['required','numeric','between:-90,90'],
            'lng'=>['required','numeric','between:-180,180'],
            'photo'=>['nullable','string','max:2200000','regex:/^data:image\\/jpeg;base64,[A-Za-z0-9+\\/=]+$/'],
        ];
    }

    public function index()
    {
        return response()->json(['reports'=>Report::query()->orderByDesc('created_at')->get()->map->toClient()]);
    }

    public function store(Request $request)
    {
        $data = $request->validate($this->rules());
        $now = now()->toIso8601String();
        $report = Report::create(array_merge($data,[
            'id'=>'AV-'.Str::upper(Str::random(12)),
            'status'=>'Pendiente', 'demo'=>false,
            'history'=>[['at'=>$now,'action'=>'Reporte registrado','from'=>null,'to'=>'Pendiente']],
        ]));
        return response()->json(['report'=>$report->toClient()],201);
    }

    public function update(Request $request, Report $report)
    {
        $data=$request->validate($this->rules());
        $history=$report->history ?? [];
        $history[]=['at'=>now()->toIso8601String(),'action'=>'Datos del reporte actualizados','from'=>null,'to'=>null];
        $report->fill($data);
        $report->history=$history;
        $report->save();
        return response()->json(['report'=>$report->toClient()]);
    }

    public function changeStatus(Request $request, Report $report)
    {
        $data=$request->validate(['status'=>['required',Rule::in(self::STATUSES)]]);
        if ($data['status']!==$report->status) {
            $history=$report->history ?? [];
            $history[]=['at'=>now()->toIso8601String(),'action'=>'Cambio de estado','from'=>$report->status,'to'=>$data['status']];
            $report->status=$data['status'];
            $report->history=$history;
            $report->save();
        }
        return response()->json(['report'=>$report->toClient()]);
    }

    public function destroy(Report $report)
    {
        $report->delete();
        return response()->json(['deleted'=>true]);
    }

    public function importBackup(Request $request)
    {
        // Importación destructiva: solo bajo sesión autenticada, con confirmación previa desde interfaz.
        $payload=$request->validate([
            'format'=>['required',Rule::in(['viaclara-backup-v1'])],
            'reports'=>['required','array','max:1000'],
            'reports.*.id'=>['required','string','max:80','distinct'],
            'reports.*.createdAt'=>['sometimes','date'],
            'reports.*.title'=>['required','string','min:5','max:90'],
            'reports.*.type'=>['required',Rule::in(self::TYPES)],
            'reports.*.severity'=>['required',Rule::in(self::SEVERITY)],
            'reports.*.sector'=>['required','string','max:70'],
            'reports.*.address'=>['required','string','max:120'],
            'reports.*.description'=>['required','string','min:12','max:1000'],
            'reports.*.lat'=>['required','numeric','between:-90,90'],
            'reports.*.lng'=>['required','numeric','between:-180,180'],
            'reports.*.status'=>['required',Rule::in(self::STATUSES)],
            'reports.*.demo'=>['sometimes','boolean'],
            'reports.*.photo'=>['nullable','string','max:2200000','regex:/^data:image\\/jpeg;base64,[A-Za-z0-9+\\/=]+$/'],
            'reports.*.history'=>['sometimes','array','max:100'],
            'reports.*.history.*.at'=>['nullable','date'],
            'reports.*.history.*.action'=>['nullable','string','max:100'],
            'reports.*.history.*.from'=>['nullable','string','max:20'],
            'reports.*.history.*.to'=>['nullable','string','max:20'],
        ]);
        DB::transaction(function () use ($payload):void {
            Report::query()->delete();
            foreach ($payload['reports'] as $r) {
                $imported = Report::create([
                    'id'=>$r['id'],'title'=>$r['title'],'type'=>$r['type'],
                    'severity'=>$r['severity'],'sector'=>$r['sector'],
                    'address'=>$r['address'],'description'=>$r['description'],
                    'lat'=>$r['lat'],'lng'=>$r['lng'],'status'=>$r['status'],
                    'photo'=>$r['photo'] ?? null,'demo'=>$r['demo'] ?? false,
                    'history'=>$r['history'] ?? [],
                ]);
                // Preservar la fecha original del respaldo cuando sea válida.
                if (!empty($r['createdAt']) && strtotime((string) $r['createdAt']) !== false) {
                    $imported->created_at = $r['createdAt'];
                    $imported->save();
                }
            }
        });
        return response()->json(['reports'=>Report::query()->orderByDesc('created_at')->get()->map->toClient()]);
    }
}
