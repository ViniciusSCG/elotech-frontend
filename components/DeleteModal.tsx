import { deletePerson } from "@/app/services/person.service";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { toast } from "./ui/use-toast";
import { useRouter } from "next/navigation";
import { DialogClose } from "@radix-ui/react-dialog";

type Props = {
  personId: string;
  onPersonDeleted: (personId: string) => void;
};

const DeleteModal = ({ personId, onPersonDeleted }: Props) => {
  const router = useRouter();
  const handleDeletePerson = async () => {
    await deletePerson(personId);
    toast({
      title: "Pessoa excluido!",
      description: "",
    });
    onPersonDeleted(personId);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Você deseja excluír o pessoa?</DialogTitle>
        <DialogDescription>
          Esta ação não pode ser desfeita. Todos os dados serão perdidos.
        </DialogDescription>
      </DialogHeader>
      <DialogClose asChild>
        <Button
          variant="destructive"
          onClick={() => {
            handleDeletePerson();
          }}
        >
          Deletar
        </Button>
      </DialogClose>
    </DialogContent>
  );
};

export default DeleteModal;
