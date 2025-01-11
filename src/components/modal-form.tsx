"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/trpc/react";

const formSchema = z.object({
  interestedStudies: z.string().min(2, {
    message: "This field is required and must be at least 2 characters.",
  }),
  formLearning: z.string({
    required_error: "This field is required.",
  }),
  studyTime: z.string().min(1, {
    message: "This field is required.",
  }),
  contact: z.string().min(2, {
    message: "This field is required and must be at least 2 characters.",
  }),
});

export function ModalProposal() {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interestedStudies: "",
      formLearning: "",
      studyTime: "",
      contact: "",
    },
  });

  const utils = api.useUtils();
  const createProposal = api.proposal.create.useMutation({
    onSuccess: () => {
      utils.proposal.invalidate(); // Invalidate queries to refetch data after mutation
      setIsOpen(false); // Close modal on successful submission
    },
    onError: (error) => {
      console.error("Error submitting proposal:", error.message);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createProposal.mutate(values); // Call the mutation with form values
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">הצעה חדשה</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Four Field Form</DialogTitle>
          <DialogDescription>
            Please fill out the following information.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="interestedStudies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interested Studies</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your study interest" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="formLearning"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Form of Learning</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a learning method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="visual">Visual</SelectItem>
                      <SelectItem value="virtual">Virtual</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="studyTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Study Time</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter study time (e.g., 2 hours/day)" {...field} />
                  </FormControl>
                  <FormDescription>
                    Please specify your preferred study time.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your contact details" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
