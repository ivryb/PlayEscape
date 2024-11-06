<script setup>
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, scrollToBottom } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CornerDownLeftIcon } from "lucide-vue-next";

const messages = ref([
  {
    id: 1,
    sender: "Hero",
    avatar: "/placeholder.svg?height=40&width=40",
    content: "Hey everyone, watch out for the dragon!",
  },
  {
    id: 2,
    sender: "Mage",
    avatar: "/placeholder.svg?height=40&width=40",
    content: "I've got a spell ready. Just say when!",
  },
  {
    id: 3,
    sender: "Archer",
    avatar: "/placeholder.svg?height=40&width=40",
    content: "Arrows are nocked and ready to fly.",
  },
  {
    id: 4,
    sender: "Tank",
    avatar: "/placeholder.svg?height=40&width=40",
    content: "I'll draw its attention. You guys hit it hard!",
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
      class="w-1/2 h-2/5 min-h-[350px] bg-background/50 border-transparent overflow-hidden flex flex-col"
    >
      <CardHeader class="p-2 bg-background/25">
        <CardTitle class="text-primary text-lg font-bold">
          Conversation with Character
        </CardTitle>
      </CardHeader>
      <ScrollArea class="flex-grow px-4" ref="scrollContainer">
        <div
          v-for="message in messages"
          :key="message.id"
          class="flex items-start space-x-2 my-4"
        >
          <Avatar>
            <AvatarImage :src="message.avatar" :alt="message.sender" />
            <AvatarFallback>{{ message.sender[0] }}</AvatarFallback>
          </Avatar>
          <div>
            <div class="font-semibold text-primary">{{ message.sender }}</div>
            <div class="text-secondary-foreground">{{ message.content }}</div>
          </div>
        </div>
      </ScrollArea>
      <form @submit.prevent="sendMessage" class="p-2">
        <div class="relative">
          <Input
            v-model="newMessage"
            type="text"
            placeholder="Type a message..."
            class="pr-12"
          />
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            class="absolute right-1 top-1/2 transform -translate-y-1/2"
          >
            <CornerDownLeftIcon class="h-4 w-4" />
            <span class="sr-only">Send message</span>
          </Button>
        </div>
      </form>
    </Card>
  </div>
</template>
