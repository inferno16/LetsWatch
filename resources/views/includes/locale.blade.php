{!! Form::open(['method' => 'POST', 'route' => 'changelocale', 'class' => 'sr-only']) !!}

    <div class="form-group @if($errors->first('locale')) has-error @endif">
        <span aria-hidden="true"><i class="fa fa-flag"></i></span>
        {!! Form::select(
            'locale',
            ['en' => 'EN', 'bg' => 'BG'],
            \App::getLocale(),
            [
                'id'       => 'locale',
                'class'    => 'form-control',
                'required' => 'required',
                'onchange' => 'this.form.submit()',
            ]
        ) !!}
        <small class="text-danger">{{ $errors->first('locale') }}</small>
    </div>

    <div class="btn-group sr-only">
        {!! Form::submit("Change", ['class' => 'btn btn-success']) !!}
    </div>

{!! Form::close() !!}