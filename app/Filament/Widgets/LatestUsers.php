<?php

namespace App\Filament\Widgets;

use App\Models\User;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class LatestUsers extends BaseWidget
{
    protected static ?string $heading = 'Latest Users';

    protected int | string $contentGridColumns = 2;
    protected static ?int $sort = 2;
protected string | int | array $columnSpan = 'full';


    protected function getTableQuery(): \Illuminate\Database\Eloquent\Builder
    {
        return User::latest()->limit(5);
    }

    protected function getTableColumns(): array
    {
        return [
            // TextColumn::make('name')
            //     ->searchable()
            //     ->sortable(),
            TextColumn::make('phone_number')
                ->searchable()
                ->sortable(),
            IconColumn::make('is_subscribed')
                ->boolean()
                ->sortable(),
            TextColumn::make('created_at')
                ->dateTime()
                ->sortable(),
        ];
    }
}
