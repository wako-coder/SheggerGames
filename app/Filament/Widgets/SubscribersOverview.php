<?php

namespace App\Filament\Widgets;

use App\Models\User;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class SubscribersOverview extends BaseWidget
{

protected static ?int $sort = 0;

    protected function getStats(): array
    {
        $totalUsersCount = User::count();
        $subscribersCount = User::where('is_subscribed', true)->count();
        $nonSubscribersCount = User::where('is_subscribed', false)->count();

        return [
            Stat::make('Total Users', $totalUsersCount)
                ->description('All registered users')
                ->color('info')
                ->icon('heroicon-o-users'),
            Stat::make('Subscribers', $subscribersCount)
                ->description('Users with active subscription')
                ->color('success')
                ->icon('heroicon-o-check-circle'),
            Stat::make('Non-Subscribers', $nonSubscribersCount)
                ->description('Users without active subscription')
                ->color('warning')
                ->icon('heroicon-o-x-circle'),
        ];
    }
}
