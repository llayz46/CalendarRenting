import { RiCalendarLine, RiDeleteBinLine } from '@remixicon/react';
import { addDays, format, isBefore } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useEffect, useState } from 'react';

import type { CalendarEvent, EventColor } from '@/components/event-calendar';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Platform } from '@/components/event-calendar/types';
import Airbnb from '@/components/icons/airbnb';
import Leboncoin from '@/components/icons/leboncoin';
import * as React from 'react';

interface EventDialogProps {
    event: CalendarEvent | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (event: CalendarEvent) => void;
    onDelete: (eventId: string) => void;
}

export function EventDialog({ event, isOpen, onClose, onSave, onDelete }: EventDialogProps) {
    const [name, setName] = useState('');
    const [price, setPrice] = useState<number>(0);
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(addDays(new Date(), 7));
    const [platform, setPlatform] = useState<Platform>('airbnb');
    const [color, setColor] = useState<EventColor>('sky');
    const [error, setError] = useState<string | null>(null);
    const [startDateOpen, setStartDateOpen] = useState(false);
    const [endDateOpen, setEndDateOpen] = useState(false);

    // Debug log to check what event is being passed
    useEffect(() => {
        console.log('EventDialog received event:', event);
    }, [event]);

    useEffect(() => {
        if (event) {
            setName(event.name || '');
            setPrice(event.price ?? 0);
            setDescription(event.description || '');

            const start = new Date(event.start);
            const end = new Date(event.end);

            setStartDate(start);
            setEndDate(end);
            setPlatform(event.platform as Platform || 'airbnb');
            setColor((event.color as EventColor) || 'sky');
            setError(null); // Reset error when opening dialog
        } else {
            resetForm();
        }
    }, [event]);

    const resetForm = () => {
        setName('');
        setPrice(0);
        setDescription('');
        setStartDate(new Date());
        setEndDate(addDays(new Date(), 7));
        setPlatform('airbnb');
        setColor('sky');
        setError(null);
    };

    const handleSave = () => {
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Validate that end date is not before start date
        if (isBefore(end, start)) {
            setError('End date cannot be before start date');
            return;
        }

        // Use generic title if empty
        const eventName = name.trim() ? name : 'Jean Dupont';

        onSave({
            id: event?.id || '',
            name: eventName,
            price: price,
            description,
            start,
            end,
            platform,
            color,
        });
    };

    const handleDelete = () => {
        if (event?.id) {
            onDelete(event.id);
        }
    };

    const platformOptions: Array<{
        value: Platform;
        label: string;
    }> = [
        {
            value: 'airbnb',
            label: 'Airbnb',
        },
        {
            value: 'leboncoin',
            label: 'Leboncoin',
        },
    ];
    const [selectedPlatform, setSelectedPlatform] = useState(platformOptions.find(option => option.value === platform)?.value || 'airbnb');
    useEffect(() => {
        setSelectedPlatform(platform);
    }, [platform]);

    // Updated color options to match types.ts
    const colorOptions: Array<{
        value: EventColor;
        label: string;
        bgClass: string;
        borderClass: string;
    }> = [
        {
            value: 'sky',
            label: 'Sky',
            bgClass: 'bg-sky-400 data-[state=checked]:bg-sky-400',
            borderClass: 'border-sky-400 data-[state=checked]:border-sky-400',
        },
        {
            value: 'amber',
            label: 'Amber',
            bgClass: 'bg-amber-400 data-[state=checked]:bg-amber-400',
            borderClass: 'border-amber-400 data-[state=checked]:border-amber-400',
        },
        {
            value: 'violet',
            label: 'Violet',
            bgClass: 'bg-violet-400 data-[state=checked]:bg-violet-400',
            borderClass: 'border-violet-400 data-[state=checked]:border-violet-400',
        },
        {
            value: 'rose',
            label: 'Rose',
            bgClass: 'bg-rose-400 data-[state=checked]:bg-rose-400',
            borderClass: 'border-rose-400 data-[state=checked]:border-rose-400',
        },
        {
            value: 'emerald',
            label: 'Emerald',
            bgClass: 'bg-emerald-400 data-[state=checked]:bg-emerald-400',
            borderClass: 'border-emerald-400 data-[state=checked]:border-emerald-400',
        },
        {
            value: 'orange',
            label: 'Orange',
            bgClass: 'bg-orange-400 data-[state=checked]:bg-orange-400',
            borderClass: 'border-orange-400 data-[state=checked]:border-orange-400',
        },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{event?.id ? 'Modifier une réservation' : 'Ajouter une réservation'}</DialogTitle>
                    <DialogDescription className="sr-only">
                        {event?.id ? 'Modifier les détails de cette réservation' : 'Ajouter une nouvelle réservation au calendrier'}
                    </DialogDescription>
                </DialogHeader>
                {error && <div className="bg-destructive/15 text-destructive rounded-md px-3 py-2 text-sm">{error}</div>}
                <div className="grid gap-4 py-4">
                    <div className="grid md:grid-cols-3 gap-2">
                        <div className="col-span-2 *:not-first:mt-1.5">
                            <Label htmlFor="name">Nom du client</Label>
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jean Dupont" />
                        </div>

                        <div>
                            <Label htmlFor="price">Tarif</Label>
                            <div className="relative mt-1.5">
                                <Input id="price" value={price ?? ''} onChange={(e) => {
                                    const value = e.target.value

                                    setPrice(value ? parseFloat(value) : 0)
                                }} placeholder="1000" />
                                <span className="absolute -translate-y-1/2 right-2 top-1/2">€</span>
                            </div>
                        </div>
                    </div>

                    <div className="*:not-first:mt-1.5">
                        <Label htmlFor="description">Informations supplémentaire</Label>
                        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="4 personnes, 2 adultes, 2 enfants..." />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1 *:not-first:mt-1.5">
                            <Label htmlFor="start-date">Date de début</Label>
                            <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        id="start-date"
                                        variant={'outline'}
                                        className={cn(
                                            'group bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]',
                                            !startDate && 'text-muted-foreground',
                                        )}
                                    >
                                        <span className={cn('truncate', !startDate && 'text-muted-foreground')}>
                                            {startDate ? format(startDate, 'PPP', { locale: fr }) : 'Choisissez une date'}
                                        </span>
                                        <RiCalendarLine size={16} className="text-muted-foreground/80 shrink-0" aria-hidden="true" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-2" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={startDate}
                                        defaultMonth={startDate}
                                        onSelect={(date) => {
                                            if (date) {
                                                setStartDate(date);
                                                // If end date is before the new start date, update it to match the start date
                                                if (isBefore(endDate, date)) {
                                                    setEndDate(date);
                                                }
                                                setError(null);
                                                setStartDateOpen(false);
                                            }
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1 *:not-first:mt-1.5">
                            <Label htmlFor="end-date">Date de fin</Label>
                            <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        id="end-date"
                                        variant={'outline'}
                                        className={cn(
                                            'group bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]',
                                            !endDate && 'text-muted-foreground',
                                        )}
                                    >
                                        <span className={cn('truncate', !endDate && 'text-muted-foreground')}>
                                            {endDate ? format(endDate, 'PPP', { locale: fr }) : 'Choisissez une date'}
                                        </span>
                                        <RiCalendarLine size={16} className="text-muted-foreground/80 shrink-0" aria-hidden="true" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-2" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={endDate}
                                        defaultMonth={endDate}
                                        disabled={{ before: startDate }}
                                        onSelect={(date) => {
                                            if (date) {
                                                setEndDate(date);
                                                setError(null);
                                                setEndDateOpen(false);
                                            }
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <fieldset className="space-y-4">
                        <legend className="text-foreground text-sm leading-none font-medium">Plateforme</legend>
                        <div className="flex gap-1.5">
                            {platformOptions.map((platformOption) => (
                                <button
                                    key={platformOption.value}
                                    onClick={() => setSelectedPlatform(platformOption.value)}
                                    className={`cursor-pointer border rounded-md px-3 py-2 h-9 w-fit transition
                                        ${selectedPlatform === platformOption.value ? 'bg-primary border-primary' : 'bg-background border-input'}
                                        focus-visible:border-ring focus-visible:ring-ring/50
                                        aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40
                                        aria-invalid:border-destructive
                                        shadow-xs outline-offset-0 outline-none
                                        focus-visible:ring-[3px] focus-visible:outline-[3px]
                                        disabled:pointer-events-none disabled:opacity-50
                                        flex items-center justify-center gap-2 overflow-hidden`}
                                >
                                    {platformOption.value === 'airbnb' ? (
                                        <Airbnb className="size-20" />
                                    ) : (
                                        <Leboncoin className="size-20" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </fieldset>

                    <fieldset className="space-y-4">
                        <legend className="text-foreground text-sm leading-none font-medium">Etiquette</legend>
                        <RadioGroup
                            className="flex gap-1.5"
                            defaultValue={colorOptions[0].value}
                            value={color}
                            onValueChange={(value: EventColor) => setColor(value)}
                        >
                            {colorOptions.map((colorOption) => (
                                <RadioGroupItem
                                    key={colorOption.value}
                                    id={`color-${colorOption.value}`}
                                    value={colorOption.value}
                                    aria-label={colorOption.label}
                                    className={cn('size-6 shadow-none', colorOption.bgClass, colorOption.borderClass)}
                                />
                            ))}
                        </RadioGroup>
                    </fieldset>
                </div>
                <DialogFooter className="flex-row sm:justify-between">
                    {event?.id && (
                        <Button variant="outline" size="icon" onClick={handleDelete} aria-label="Delete event">
                            <RiDeleteBinLine size={16} aria-hidden="true" />
                        </Button>
                    )}
                    <div className="flex flex-1 justify-end gap-2">
                        <Button variant="outline" onClick={onClose}>
                            Annuler
                        </Button>
                        <Button onClick={handleSave}>Ajouter</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
