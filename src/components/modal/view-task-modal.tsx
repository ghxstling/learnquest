/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useEffect, useMemo, useState } from "react";
import React from "react";
import { Label } from "../ui/label";
import { useUserService } from "@/../convex/services/userService";
import { CircleAlert } from "lucide-react";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: any;
}

export function ViewTaskModal({ isOpen, onClose, task }: TaskModalProps) {
  const userService = useUserService();

  const [assignedBy, setAssignedBy] = useState<string>("");

  const css = {
    Label: "text-right col-span-1",
    Info: "text-gray-600 text-sm col-span-4",
  };
  useEffect(() => {
    const fetchData = async () => {
      const user = await userService.getUserById(task.assignedBy);
      setAssignedBy(`${user!.firstName} ${user!.lastName}`);
    };

    fetchData();
  }, [task, userService]);

  const days = useMemo(
    () => new Date().getDate() - new Date(task.dueDate).getDate(),
    [task],
  );
  const hours = useMemo(
    () => new Date().getHours() - new Date(task.dueDate).getHours(),
    [task],
  );
  const minutes = useMemo(
    () => new Date().getMinutes() - new Date(task.dueDate).getMinutes(),
    [task],
  );

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[40rem] border-2 p-4">
        <DialogHeader>
          <div className="flex flex-row justify-between">
            <DialogTitle>Task Information</DialogTitle>
            {task.isCompleted === "Overdue" && (
              <div className="flex flex-row gap-1 text-red-500">
                <CircleAlert className="size-3.5" />
                <Label className="mr-8">
                  {"This task was due "}
                  {days < 1
                    ? hours < 1
                      ? minutes + " minutes ago"
                      : hours + " hours ago"
                    : days + " days ago"}
                </Label>
              </div>
            )}
          </div>
        </DialogHeader>
        <div className="grid grid-cols-5 items-center gap-3">
          <Label className={css.Label}>Title:</Label>
          <div className={css.Info}>{task.title}</div>
          <Label className={css.Label}>Description:</Label>
          <div className={css.Info}>{task.description}</div>
          <Label className={css.Label}>Due Date:</Label>
          <div className={css.Info}>
            {new Date(task.dueDate).toLocaleString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            })}
          </div>
          <Label className={css.Label}>Assigned By:</Label>
          <div className={css.Info}>{assignedBy}</div>
          <Label className={css.Label}>Completed By:</Label>
          <div className={css.Info + " flex items-center justify-between"}>
            {task.completedBy.length} students{" "}
            <Button type="button" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
