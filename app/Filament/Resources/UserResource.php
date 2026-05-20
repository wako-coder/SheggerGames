<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UserResource\Pages;
use App\Models\User;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class UserResource extends Resource
{
    protected static ?string $model = User::class;
    protected static ?string $navigationIcon = 'heroicon-o-users';
    protected static ?string $navigationLabel = 'Subscribers';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\TextInput::make('phone_number')->required(),
            Forms\Components\TextInput::make('product_number'),
            Forms\Components\Toggle::make('is_subscribed'),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('phone_number')->searchable()->sortable(),
                Tables\Columns\TextColumn::make('product_number')->searchable()->default('—'),
                Tables\Columns\IconColumn::make('is_subscribed')->boolean()->label('Subscribed'),
                Tables\Columns\TextColumn::make('created_at')->dateTime()->sortable()->label('Registered'),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                TernaryFilter::make('is_subscribed')->label('Subscription Status')
                    ->trueLabel('Subscribed')->falseLabel('Unsubscribed'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index'  => Pages\ListUsers::route('/'),
            'create' => Pages\CreateUser::route('/create'),
            'edit'   => Pages\EditUser::route('/{record}/edit'),
        ];
    }
}
