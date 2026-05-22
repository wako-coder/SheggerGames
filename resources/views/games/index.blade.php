@extends('layouts.app')

@section('content')
<div class="container">
    <div class="section_title text-center mb-60">
        <h2>{{ __('messages.all_games') }}</h2>
    </div>

    <div class="row">
        @if(isset($games) && count($games) > 0)
            @foreach($games as $game)
            <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div class="card">
                    <a href="{{ $game['external_url'] }}" target="_blank">
                        <img src="{{ $game['image_url'] }}" class="card-img-top" alt="{{ $game['name'] }}" style="height: 200px; object-fit: cover;">
                    </a>
                    <div class="card-body">
                        <h5 class="card-title">{{ Str::limit($game['name'], 30) }}</h5>
                        <a href="{{ $game['external_url'] }}" target="_blank" class="btn btn-primary">{{ __('messages.play_now') }}</a>
                    </div>
                </div>
            </div>
            @endforeach
        @else
            <div class="col-12">
                <p class="text-center">{{ __('messages.no_games') }}</p>
            </div>
        @endif
    </div>
</div>
@endsection