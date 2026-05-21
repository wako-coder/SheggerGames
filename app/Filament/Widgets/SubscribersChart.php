<?php

namespace App\Filament\Widgets;

use App\Models\User;
use Filament\Widgets\ChartWidget;
use Flowframe\Trend\Trend;
use Flowframe\Trend\TrendValue;
use Illuminate\Support\Carbon;

class SubscribersChart extends ChartWidget
{
    protected static ?string $heading = 'Subscribers';

    public ?string $filter = 'month';

    protected static ?int $sort = 1;
    // This makes the widget take up all available horizontal columns
protected string | int | array $columnSpan = 'full';

    protected function getFilters(): ?array
    {
        return [
            'day' => 'Day',
            'week' => 'Week',
            'month' => 'Month',
            'year' => 'Year',
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }

    protected function getData(): array
    {
        // Subscribed users
        $subscriptionsData = match ($this->filter) {
            'day' => Trend::query(User::query()->where('is_subscribed', true))
                ->between(
                    start: now()->startOfDay()->subDays(7),
                    end: now()->endOfDay(),
                )
                ->perDay()
                ->count(),

            'week' => Trend::query(User::query()->where('is_subscribed', true))
                ->between(
                    start: now()->startOfWeek()->subWeeks(4),
                    end: now()->endOfWeek(),
                )
                ->perWeek()
                ->count(),

            'month' => Trend::query(User::query()->where('is_subscribed', true))
                ->between(
                    start: now()->startOfYear(),
                    end: now()->endOfYear(),
                )
                ->perMonth()
                ->count(),

            'year' => Trend::query(User::query()->where('is_subscribed', true))
                ->between(
                    start: now()->subYears(5)->startOfYear(),
                    end: now()->endOfYear(),
                )
                ->perYear()
                ->count(),

            default => Trend::query(User::query()->where('is_subscribed', true))
                ->between(
                    start: now()->startOfYear(),
                    end: now()->endOfYear(),
                )
                ->perMonth()
                ->count(),
        };

        // Unsubscribed users
        $unsubscriptionsData = match ($this->filter) {
            'day' => Trend::query(User::query()->where('is_subscribed', false))
                ->between(
                    start: now()->startOfDay()->subDays(7),
                    end: now()->endOfDay(),
                )
                ->perDay()
                ->count(),

            'week' => Trend::query(User::query()->where('is_subscribed', false))
                ->between(
                    start: now()->startOfWeek()->subWeeks(4),
                    end: now()->endOfWeek(),
                )
                ->perWeek()
                ->count(),

            'month' => Trend::query(User::query()->where('is_subscribed', false))
                ->between(
                    start: now()->startOfYear(),
                    end: now()->endOfYear(),
                )
                ->perMonth()
                ->count(),

            'year' => Trend::query(User::query()->where('is_subscribed', false))
                ->between(
                    start: now()->subYears(5)->startOfYear(),
                    end: now()->endOfYear(),
                )
                ->perYear()
                ->count(),

            default => Trend::query(User::query()->where('is_subscribed', false))
                ->between(
                    start: now()->startOfYear(),
                    end: now()->endOfYear(),
                )
                ->perMonth()
                ->count(),
        };

        // All registrations
        $registrationsData = match ($this->filter) {
            'day' => Trend::model(User::class)
                ->between(
                    start: now()->startOfDay()->subDays(7),
                    end: now()->endOfDay(),
                )
                ->perDay()
                ->count(),

            'week' => Trend::model(User::class)
                ->between(
                    start: now()->startOfWeek()->subWeeks(4),
                    end: now()->endOfWeek(),
                )
                ->perWeek()
                ->count(),

            'month' => Trend::model(User::class)
                ->between(
                    start: now()->startOfYear(),
                    end: now()->endOfYear(),
                )
                ->perMonth()
                ->count(),

            'year' => Trend::model(User::class)
                ->between(
                    start: now()->subYears(5)->startOfYear(),
                    end: now()->endOfYear(),
                )
                ->perYear()
                ->count(),

            default => Trend::model(User::class)
                ->between(
                    start: now()->startOfYear(),
                    end: now()->endOfYear(),
                )
                ->perMonth()
                ->count(),
        };

        return [
            'datasets' => [
                [
                    'label' => 'New Subscriptions',
                    'data' => $subscriptionsData->map(
                        fn (TrendValue $value) => $value->aggregate
                    ),
                    'borderColor' => '#22c55e',
                    'backgroundColor' => '#22c55e',
                ],

                [
                    'label' => 'Unsubscribed Users',
                    'data' => $unsubscriptionsData->map(
                        fn (TrendValue $value) => $value->aggregate
                    ),
                    'borderColor' => '#ef4444',
                    'backgroundColor' => '#ef4444',
                ],

                [
                    'label' => 'Total Registrations',
                    'data' => $registrationsData->map(
                        fn (TrendValue $value) => $value->aggregate
                    ),
                    'borderColor' => '#3b82f6',
                    'backgroundColor' => '#3b82f6',
                ],
            ],

            'labels' => $subscriptionsData->map(function (TrendValue $value) {
                return match ($this->filter) {
                    'day' => Carbon::parse($value->date)->format('M d'),

                    'week' => (function () use ($value) {
                        [$year, $week] = explode('-', $value->date);

                        return Carbon::now()
                            ->setISODate((int) $year, (int) $week)
                            ->format('\W\e\e\k W, Y');
                    })(),

                    'month' => Carbon::createFromFormat('Y-m', $value->date)
                        ->format('M Y'),

                    'year' => Carbon::parse($value->date)->format('Y'),

                    default => Carbon::parse($value->date)->format('M Y'),
                };
            }),
        ];
    }
}