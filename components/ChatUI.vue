<script setup>
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, scrollToBottom } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CornerDownLeftIcon, XIcon } from "lucide-vue-next";

const messages = ref([
  {
    id: 1,
    sender: "Medusa",
    avatar: "/game/Characters/cool_thief_girl/avatar.png",
    content: "...",
  },
]);
const newMessage = ref("");
const scrollContainer = ref(null);

const sendMessage = () => {
  if (newMessage.value.trim()) {
    messages.value.push({
      id: messages.value.length + 1,
      sender: "You",
      avatar: "/placeholder.svg?height=40&width=40",
      content: newMessage.value.trim(),
    });
    newMessage.value = "";
    scrollToBottom(scrollContainer);
  }
};

onMounted(() => {
  scrollToBottom(scrollContainer);
});
</script>

<template>
  <div
    class="absolute top-0 left-0 w-full h-full pb-4 flex justify-center items-end"
  >
    <Card
      class="w-1/2 min-w-[400px] max-w-[600px] h-2/5 min-h-[350px] max-h-[500px] bg-background/70 overflow-hidden flex flex-col text-stone-200"
    >
      <CardHeader
        class="p-2 bg-background/50 flex flex-row justify-between items-center"
      >
        <CardTitle class="text-lg"> Conversation with Character </CardTitle>
        <Button variant="ghost" size="icon" class="h-8 w-8">
          <XIcon />
          <span class="sr-only">Close</span>
        </Button>
      </CardHeader>
      <ScrollArea class="flex-grow px-4" ref="scrollContainer">
        <div
          v-for="message in messages"
          :key="message.id"
          class="flex items-start space-x-3 my-4"
        >
          <Avatar class="rounded-md bg-background/50">
            <AvatarImage :src="message.avatar" :alt="message.sender" />
            <AvatarFallback>{{ message.sender[0] }}</AvatarFallback>
          </Avatar>
          <div>
            <div class="font-semibold text-primary leading-none pt-[1px] mb-1">
              {{ message.sender }}
            </div>
            <div>{{ message.content }}</div>
          </div>
        </div>
      </ScrollArea>
      <form @submit.prevent="sendMessage" class="p-2">
        <div class="relative">
          <Input
            v-model="newMessage"
            type="text"
            placeholder="Type a message..."
            class="pr-12 bg-background/50 h-[44px] text-stone-200"
          />
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            class="absolute right-1 top-1"
          >
            <CornerDownLeftIcon />
            <span class="sr-only">Send message</span>
          </Button>
        </div>
      </form>
    </Card>
  </div>
</template>
