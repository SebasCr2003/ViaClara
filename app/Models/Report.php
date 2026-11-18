<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = [
        'id','title','type','severity','sector','address','description',
        'lat','lng','status','photo','demo','history',
    ];
    protected function casts(): array
    {
        return ['lat'=>'float','lng'=>'float','demo'=>'boolean','history'=>'array'];
    }

    public function toClient(): array
    {
        return [
            'id'=>$this->id, 'title'=>$this->title, 'type'=>$this->type,
            'severity'=>$this->severity, 'sector'=>$this->sector,
            'address'=>$this->address, 'description'=>$this->description,
            'lat'=>$this->lat, 'lng'=>$this->lng, 'status'=>$this->status,
            'photo'=>$this->photo ?: '', 'demo'=>(bool) $this->demo,
            'history'=>$this->history ?? [],
            'createdAt'=>$this->created_at?->toIso8601String(),
            'updatedAt'=>$this->updated_at?->toIso8601String(),
        ];
    }
}
