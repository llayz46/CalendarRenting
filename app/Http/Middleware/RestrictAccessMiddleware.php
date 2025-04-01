<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RestrictAccessMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $authorizedIpPrefix = env('AUTHORIZED_IP_PREFIX');
        $requestIp = $request->getClientIp();

        if (empty($authorizedIpPrefix)) {
            abort(500, 'La variable d\'environnement AUTHORIZED_IP_PREFIX n\'est pas définie.');
        }

        if (!str_starts_with($requestIp, $authorizedIpPrefix)) {
            abort(403, 'Accès non autorisé.');
        }

        return $next($request);
    }
}
