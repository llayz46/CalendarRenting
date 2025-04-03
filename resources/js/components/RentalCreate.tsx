import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { LoaderCircle } from 'lucide-react';
import { Transition } from '@headlessui/react';

type RentalForm = {
    name: string;
};

export function RentalCreate() {
    const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm<Required<RentalForm>>({
        name: '',
    });

    const handleRentalCreate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        post(route('rentals.store'), {
            onSuccess: () => reset('name'),
        });
    }

    return (
        <form className="p-6 flex flex-col gap-4" onSubmit={handleRentalCreate}>
            <Label>Nom du gîte</Label>
            <Input
                id="name"
                type="text"
                required
                autoFocus
                tabIndex={1}
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                placeholder="Cahors"
            />
            <InputError message={errors.name} />
            <Button className="cursor-pointer">
                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                Créer le gîte
            </Button>

            <Transition
                show={recentlySuccessful}
                enter="transition ease-in-out"
                enterFrom="opacity-0"
                leave="transition ease-in-out"
                leaveTo="opacity-0"
            >
                <p className="text-sm text-green-600">Créer avec succès</p>
            </Transition>
        </form>
    )
}
