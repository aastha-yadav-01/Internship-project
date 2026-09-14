import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Reference implementations from shadcn/ui, used only to compare against the
// hand-built Modal.tsx and Tabs.tsx in this same folder. See NOTES.md.
export function ShadcnDemo() {
  return (
    <div className="playground-app">
      <h2>shadcn/ui reference: Dialog</h2>
      <Dialog>
        <DialogTrigger asChild>
          <button type="button">Open shadcn dialog</button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>shadcn dialog</DialogTitle>
          </DialogHeader>
          <p>Built on Radix UI's Dialog primitive.</p>
        </DialogContent>
      </Dialog>

      <h2>shadcn/ui reference: Tabs</h2>
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">Profile panel content.</TabsContent>
        <TabsContent value="settings">Settings panel content.</TabsContent>
      </Tabs>
    </div>
  );
}
