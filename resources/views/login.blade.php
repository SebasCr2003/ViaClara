<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Acceso · VíaClara</title>
<style>
*{box-sizing:border-box}body{margin:0;font-family:system-ui,-apple-system,sans-serif;background:linear-gradient(135deg,#eaf7f5,#eff2f8);min-height:100vh;display:grid;place-items:center;color:#132747}
main{width:min(420px,92vw);background:#fff;border-radius:20px;padding:34px;box-shadow:0 25px 60px #13274716}
h1{margin:0;color:#083e4b;font-size:33px}p{color:#526376;line-height:1.55}label{display:block;font-weight:700;font-size:14px;margin-top:20px}input{margin-top:8px;width:100%;padding:13px;border-radius:10px;border:1px solid #ccd8df;font-size:16px}button{width:100%;margin-top:25px;background:#057b78;color:#fff;border:0;border-radius:11px;padding:14px;font-size:16px;font-weight:700;cursor:pointer}.error{color:#b02d35;font-size:14px;margin:10px 0}
small{display:block;color:#6b788a;margin-top:24px}
</style></head><body><main>
<div style="font-weight:800;letter-spacing:.12em;color:#078e8a;font-size:13px">PROYECTO DE GRADO · UNAD</div>
<h1>VíaClara</h1><p>Ingresa para gestionar y consultar las afectaciones viales registradas.</p>
<form method="post" action="{{ route('login.submit') }}">@csrf
<label>Correo<input name="email" type="email" required autocomplete="username" value="{{ old('email') }}" placeholder="admin@viaclara.local"></label>
<label>Contraseña<input name="password" type="password" required autocomplete="current-password" placeholder="Tu contraseña"></label>
@if ($errors->any()) <div class="error">{{ $errors->first() }}</div> @endif
<button type="submit">Ingresar a la plataforma</button>
</form><small>Plataforma web georreferenciada · Florencia, Caquetá</small></main></body></html>
