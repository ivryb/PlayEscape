export { default as ScrollArea } from "./ScrollArea.vue";
export { default as ScrollBar } from "./ScrollBar.vue";

export const scrollToBottom = (scrollContainer: Ref<HTMLElement | null>) => {
  nextTick(() => {
    if (scrollContainer.value) {
      const viewport = scrollContainer.value.$el.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (viewport) {
        viewport.scrollTo({
          top: viewport.scrollHeight,
          behavior: "smooth",
        });
      }
    }
  });
};
