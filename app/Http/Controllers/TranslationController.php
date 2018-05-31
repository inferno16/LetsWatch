<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Session;

class TranslationController extends Controller
{
    /**
     * Change session locale
     * @param  Request $request
     * @return Response
     */
    public function changeLocale(Request $request)
    {
        $this->validate($request, ['locale' => 'required|in:bg,en']);

        session()->put('locale', $request->locale);

        return redirect()->back();
    }
}
