"use client";

import { useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft, Loader2 } from "lucide-react";

import { useParams, useRouter } from "next/navigation";
import useLoadingStore from "@/store/loading";

import { useEffect, useState } from "react";
import {
  createPerson,
  getPersonById,
  updatePerson,
} from "@/app/services/person.service";
import { IPersonProps } from "../table-person";

const FormSchema = z.object({
  name: z.string().nonempty({ message: "Nome Obrigatório." }),
  cpf: z
    .string()
    .nonempty({ message: "CPF Obrigatório." })
    .refine((cpf) => cpf.length == 11, {
      message: "CPF deve conter 11 caracteres.",
    }),
  dataNascimento: z
    .string()
    .nonempty({ message: "Data de Nascimento Obrigatório." }),
  contatos: z
    .array(
      z.object({
        email: z.string().email({ message: "Email inválido." }),
        phone: z.string(),
        personId: z.number().optional(),
      })
    )
    .nonempty({ message: "Contato Obrigatório." }),
});
export function FormPerson() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [person, setPerson] = useState<IPersonProps>();

  const { isLoading, setIsLoading } = useLoadingStore();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      cpf: "",
      dataNascimento: "",
      contatos: [{ email: "", phone: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "contatos",
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setIsLoading(true);
    try {
      const body = {
        name: data.name,
        cpf: data.cpf,
        birthdate: data.dataNascimento,
        contacts: data.contatos,
      };

      if (id) {
        await updatePerson(id.toString(), body);
        toast({
          title: "Pessoa atualizada com sucesso!",
          description: "",
        });
      } else {
        await createPerson(body);
        toast({
          title: "Pessoa criada com sucesso!",
          description: "",
        });
      }

      setIsLoading(false);
      router.push("/");
    } catch (error) {
      setIsLoading(false);
    }
  });

  useEffect(() => {
    if (!id) return;
    const fetchPersons = async () => {
      const response = await getPersonById(id.toString());
      setPerson(response);
      form.reset({
        name: response.name,
        cpf: response.cpf,
        dataNascimento: new Date(response.birthdate)
          .toISOString()
          .split("T")[0],
        contatos: response.contacts.map(
          (contact: { email: any; phone: any }) => ({
            email: contact.email,
            phone: contact.phone,
            personId: Number(id),
          })
        ),
      });
    };
    fetchPersons();
  }, [id]);

  return (
    <>
      <div className="mb-5">
        <Button
          variant="outline"
          className="ml-auto"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </div>
      <div className="flex flex-row gap-2 justify-start items-center font-poppins mb-2 py-3 tracking-wider h-12 text-3xl font-extrabold">
        {id ? "Editar Pessoa" : "Criar Pessoa"}
      </div>
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-8 flex flex-col">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o nome da pessoa" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col md:flex-row gap-6">
            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem className="w-full md:w-56">
                  <FormLabel>CPF</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o CPF da Pessoa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dataNascimento"
              render={({ field }) => (
                <FormItem className="w-full md:w-56">
                  <FormLabel>Data de Nascimento</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      placeholder="Digite a data de nascimento"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end">
            <Button
              type="button"
              className="w-full md:w-[15%] px-4"
              onClick={() => append({ email: "", phone: "" })}
            >
              Adicionar Contato
            </Button>
          </div>
          {fields.map((item, index) => (
            <div key={item.id}>
              <FormField
                control={form.control}
                name={`contatos.${index}.email`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite o email do contato"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`contatos.${index}.phone`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite o telefone do contato"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="mt-4" onClick={() => remove(index)}>
                Remover Contato
              </Button>
            </div>
          ))}
          <Button
            type="submit"
            className="w-full md:w-[10%] bg-red-600 text-white"
          >
            {isLoading && (
              <Loader2 className="w-3 h-3 mr-3 animate-spin text-white" />
            )}
            Enviar
          </Button>
        </form>
      </Form>
    </>
  );
}
