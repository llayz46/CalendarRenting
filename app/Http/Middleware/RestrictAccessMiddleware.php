<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RestrictAccessMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $authorizedIp = env('AUTHORIZED_IP_ACCESS');
        $requestIp = $request->getClientIp();

        if (empty($authorizedIp)) {
            abort(500, 'La variable d\'environnement AUTHORIZED_IP_ACCESS n\'est pas définie.');
        }

        if ($requestIp !== $authorizedIp) {
            abort(403, 'Accès non autorisé.');
        }

        return $next($request);
    }
}
