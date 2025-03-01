import { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCreateEvent } from "@/api/queries/eventsQueries";
import { useSelector } from "react-redux";
import { selectUserData } from "@/redux/userSlice";
import { EventPayload, EventSchema } from "@/api/schemas/eventSchema";
import { Clock, MapPin, Tag, Users, Plus, X, ChevronDown, ChevronUp, Calendar } from 'lucide-react';

export const AddEventDialog = () => {
  const { mutate, isLoading } = useCreateEvent();
  const userData = useSelector(selectUserData);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("basics");
  const [tagInput, setTagInput] = useState("");
  const [expandedSessions, setExpandedSessions] = useState<number[]>([0]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<EventPayload>({
    resolver: zodResolver(EventSchema),
    defaultValues: {
      companyId: userData?.roles[0]?.companyId || "03m7jjn4fn1001",
      description: "",
      endTime: new Date().toISOString(),
      eventPrivacyType: "PRIVATE",
      eventType: "SEMINAR",
      location: "",
      locationLink: "",
      maxAttendeeCount: 0,
      name: "",
      sessions: [
        {
          endDate: new Date().toISOString(),
          location: "",
          price: 0,
          queueNo: 0,
          speaker: {
            contactEmail: "",
            contactPhoneNo: "",
            description: "",
            facebookLink: "",
            fullName: "",
            instagramLink: "",
            linkedinLink: "",
          },
          startDate: new Date().toISOString(),
        },
      ],
      startTime: new Date().toISOString(),
      tags: [],
      userId: userData?.id || "",
    },
  });

  // For handling the sessions array
  const { fields, append, remove } = useFieldArray({
    control,
    name: "sessions",
  });

  // For handling tags array
  const tags = watch("tags");

  const addTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setValue("tags", [...tags, tagInput]);
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    setValue(
      "tags",
      tags.filter((_, i) => i !== index)
    );
  };

  const toggleSessionExpand = (index: number) => {
    if (expandedSessions.includes(index)) {
      setExpandedSessions(expandedSessions.filter((i) => i !== index));
    } else {
      setExpandedSessions([...expandedSessions, index]);
    }
  };

  // Helper function to convert date-time inputs to ISO strings
  const formatDateForSubmit = (dateStr: string) => {
    return new Date(dateStr).toISOString();
  };

  const onSubmit = (data: EventPayload) => {
    // Format dates properly
    data.startTime = formatDateForSubmit(data.startTime);
    data.endTime = formatDateForSubmit(data.endTime);

    data.sessions = data.sessions.map((session) => ({
      ...session,
      startDate: formatDateForSubmit(session.startDate),
      endDate: formatDateForSubmit(session.endDate),
      price: Number(session.price),
      queueNo: Number(session.queueNo),
    }));

    // Ensure userId is taken from redux
    if (userData) {
      data.userId = userData.id;
    }

    // Convert maxAttendeeCount to number
    data.maxAttendeeCount = Number(data.maxAttendeeCount);

    console.log("Submitting data:", data);

    mutate(data, {
      onSuccess: () => {
        console.log("Event created successfully");
        reset();
        setIsOpen(false);
      },
      onError: (error) => {
        console.error("Failed to create event:", error);
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          className="ml-auto bg-primary hover:bg-primary/90 text-white" 
          onClick={() => setIsOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Event
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 bg-white border-0 shadow-lg">
        <DialogHeader className="px-6 pt-6 pb-2 bg-gradient-to-r from-primary/10 to-primary/5 border-b">
          <DialogTitle className="text-2xl font-bold text-primary">
            <Calendar className="inline-block mr-2 h-6 w-6 text-primary" />
            Create New Event
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="px-6 pt-4">
              <TabsList className="grid grid-cols-3 w-full bg-muted/50">
                <TabsTrigger 
                  value="basics" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  Basic Info
                </TabsTrigger>
                <TabsTrigger 
                  value="details"
                  className="data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  Details & Tags
                </TabsTrigger>
                <TabsTrigger 
                  value="sessions"
                  className="data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  Sessions
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="basics" className="px-6 py-4 space-y-6">
              <Card className="border border-muted/60 shadow-sm">
                <CardHeader className="bg-muted/20 pb-3">
                  <CardTitle className="text-lg text-primary flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    Event Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/80">Event Name</label>
                      <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                          <Input 
                            placeholder="Event Name" 
                            {...field} 
                            className="border-muted-foreground/20 focus:border-primary focus:ring-primary/30"
                          />
                        )}
                      />
                      {errors.name && (
                        <p className="text-destructive text-sm">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/80">Company ID</label>
                      <Controller
                        name="companyId"
                        control={control}
                        render={({ field }) => (
                          <Input 
                            placeholder="Company ID" 
                            {...field} 
                            className="border-muted-foreground/20 focus:border-primary focus:ring-primary/30"
                          />
                        )}
                      />
                      {errors.companyId && (
                        <p className="text-destructive text-sm">
                          {errors.companyId.message}
                        </p>
                      )}
                    </div> */}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/80">Description</label>
                    <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <Textarea
                          placeholder="Provide a detailed description of the event"
                          className="min-h-[100px] border-muted-foreground/20 focus:border-primary focus:ring-primary/30"
                          {...field}
                        />
                      )}
                    />
                    {errors.description && (
                      <p className="text-destructive text-sm">
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/80">Event Type</label>
                      <Controller
                        name="eventType"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="border-muted-foreground/20 focus:ring-primary/30">
                              <SelectValue placeholder="Select event type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="SEMINAR">Seminar</SelectItem>
                              <SelectItem value="WORKSHOP">Workshop</SelectItem>
                              <SelectItem value="CONFERENCE">
                                Conference
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.eventType && (
                        <p className="text-destructive text-sm">
                          {errors.eventType.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/80">Privacy</label>
                      <Controller
                        name="eventPrivacyType"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="border-muted-foreground/20 focus:ring-primary/30">
                              <SelectValue placeholder="Select privacy type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PRIVATE">Private</SelectItem>
                              <SelectItem value="PUBLIC">Public</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.eventPrivacyType && (
                        <p className="text-destructive text-sm">
                          {errors.eventPrivacyType.message}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-muted/60 shadow-sm">
                <CardHeader className="bg-muted/20 pb-3">
                  <CardTitle className="text-lg text-primary flex items-center">
                    <Clock className="mr-2 h-5 w-5" />
                    Time & Location
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center text-foreground/80">
                        <Clock className="h-4 w-4 mr-2 text-primary/70" /> Start Time
                      </label>
                      <Controller
                        name="startTime"
                        control={control}
                        render={({ field }) => (
                          <Input 
                            type="datetime-local" 
                            {...field} 
                            className="border-muted-foreground/20 focus:border-primary focus:ring-primary/30"
                          />
                        )}
                      />
                      {errors.startTime && (
                        <p className="text-destructive text-sm">
                          {errors.startTime.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center text-foreground/80">
                        <Clock className="h-4 w-4 mr-2 text-primary/70" /> End Time
                      </label>
                      <Controller
                        name="endTime"
                        control={control}
                        render={({ field }) => (
                          <Input 
                            type="datetime-local" 
                            {...field} 
                            className="border-muted-foreground/20 focus:border-primary focus:ring-primary/30"
                          />
                        )}
                      />
                      {errors.endTime && (
                        <p className="text-destructive text-sm">
                          {errors.endTime.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center text-foreground/80">
                        <MapPin className="h-4 w-4 mr-2 text-primary/70" /> Location
                      </label>
                      <Controller
                        name="location"
                        control={control}
                        render={({ field }) => (
                          <Input 
                            placeholder="Event location" 
                            {...field} 
                            className="border-muted-foreground/20 focus:border-primary focus:ring-primary/30"
                          />
                        )}
                      />
                      {errors.location && (
                        <p className="text-destructive text-sm">
                          {errors.location.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/80">
                        Location Link
                      </label>
                      <Controller
                        name="locationLink"
                        control={control}
                        render={({ field }) => (
                          <Input 
                            placeholder="https://..." 
                            {...field} 
                            className="border-muted-foreground/20 focus:border-primary focus:ring-primary/30"
                          />
                        )}
                      />
                      {errors.locationLink && (
                        <p className="text-destructive text-sm">
                          {errors.locationLink.message}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="px-6 py-4 space-y-6">
              <Card className="border border-muted/60 shadow-sm">
                <CardHeader className="bg-muted/20 pb-3">
                  <CardTitle className="text-lg text-primary flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    Additional Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center text-foreground/80">
                      <Users className="h-4 w-4 mr-2 text-primary/70" /> Maximum Attendees
                    </label>
                    <Controller
                      name="maxAttendeeCount"
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                          className="border-muted-foreground/20 focus:border-primary focus:ring-primary/30"
                        />
                      )}
                    />
                    {errors.maxAttendeeCount && (
                      <p className="text-destructive text-sm">
                        {errors.maxAttendeeCount.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center text-foreground/80">
                      <Tag className="h-4 w-4 mr-2 text-primary/70" /> Tags
                    </label>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Add a tag"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addTag();
                          }
                        }}
                        className="flex-1 border-muted-foreground/20 focus:border-primary focus:ring-primary/30"
                      />
                      <Button 
                        type="button" 
                        onClick={addTag} 
                        size="sm"
                        className="bg-primary hover:bg-primary/90"
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {tags.length === 0 && (
                        <div className="text-sm text-muted-foreground italic">
                          No tags added yet
                        </div>
                      )}
                      {tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="flex items-center gap-1 bg-primary/10 text-primary hover:bg-primary/15"
                        >
                          {tag}
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="h-4 w-4 p-0 hover:bg-transparent text-primary/70 hover:text-primary"
                            onClick={() => removeTag(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sessions" className="px-6 py-4 space-y-6">
              {fields.map((field, index) => (
                <Card key={field.id} className="overflow-hidden border border-muted/60 shadow-sm">
                  <CardHeader className="py-3 px-4 bg-muted/20 border-b border-muted/30">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg flex items-center text-primary">
                        Session {index + 1}
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        {index > 0 && (
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={() => remove(index)}
                            className="bg-destructive/90 hover:bg-destructive"
                          >
                            Remove
                          </Button>
                        )}
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleSessionExpand(index)}
                          className="text-primary hover:text-primary/80 hover:bg-primary/10"
                        >
                          {expandedSessions.includes(index) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {expandedSessions.includes(index) && (
                    <CardContent className="p-4 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground/80">
                            Location
                          </label>
                          <Controller
                            name={`sessions.${index}.location`}
                            control={control}
                            render={({ field }) => (
                              <Input
                                placeholder="Session location"
                                {...field}
                                className="border-muted-foreground/20 focus:border-primary focus:ring-primary/30"
                              />
                            )}
                          />
                          {errors.sessions?.[index]?.location && (
                            <p className="text-destructive text-sm">
                              {errors.sessions[index]?.location?.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground/80">Price</label>
                          <Controller
                            name={`sessions.${index}.price`}
                            control={control}
                            render={({ field }) => (
                              <Input
                                type="number"
                                placeholder="0.00"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(e.target.valueAsNumber)
                                }
                                className="border-muted-foreground/20 focus:border-primary focus:ring-primary/30"
                              />
                            )}
                          />
                          {errors.sessions?.[index]?.price && (
                            <p className="text-destructive text-sm">
                              {errors.sessions[index]?.price?.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground/80">
                            Queue Number
                          </label>
                          <Controller
                            name={`sessions.${index}.queueNo`}
                            control={control}
                            render={({ field }) => (
                              <Input
                                type="number"
                                placeholder="0"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(e.target.valueAsNumber)
                                }
                                className="border-muted-foreground/20 focus:border-primary focus:ring-primary/30"
                              />
                            )}
                          />
                          {errors.sessions?.[index]?.queueNo && (
                            <p className="text-destructive text-sm">
                              {errors.sessions[index]?.queueNo?.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground/80">
                            Start Date
                          </label>
                          <Controller
                            name={`sessions.${index}.startDate`}
                            control={control}
                            render={({ field }) => (
                              <Input 
                                type="datetime-local" 
                                {...field} 
                                className="border-muted-foreground/20 focus:border-primary focus:ring-primary/30"
                              />
                            )}
                          />
                          {errors.sessions?.[index]?.startDate && (
                            <p className="text-destructive text-sm">
                              {errors.sessions[index]?.startDate?.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground/80">
                            End Date
                          </label>
                          <Controller
                            name={`sessions.${index}.endDate`}
                            control={control}
                            render={({ field }) => (
                              <Input 
                                type="datetime-local" 
                                {...field} 
                                className="border-muted-foreground/20 focus:border-primary focus:ring-primary/30"
                              />
                            )}
                          />
                          {errors.sessions?.[index]?.endDate && (
                            <p className="text-destructive text-sm">
                              {errors.sessions[index]?.endDate?.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <Separator className="bg-muted/40" />

                      <div className="space-y-4">
                        <h3 className="font-medium text-primary">Speaker Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground/80">
                              Full Name
                            </label>
                            <Controller
                              name={`sessions.${index}.speaker.fullName`}
                              control={control}
                              render={({ field }) => (
                                <Input 
                                  placeholder="Speaker name" 
                                  {...field} 
                                  className="border-muted-foreground/20 focus:border-primary focus:ring-primary/30"
                                />
                              )}
                            />
                            {errors.sessions?.[index]?.speaker?.fullName && (
                              <p className="text-destructive text-sm">
                                {
                                  errors.sessions[index]?.speaker?.fullName
                                    ?.message
                                }
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground/80">Email</label>
                            <Controller
                              name={`sessions.${index}.speaker.contactEmail`}
                              control={control}
                              render={({ field }) => (
                                <Input
                                  type="email"
                                  placeholder="speaker@example.com"
                                  {...field}
                                  className="border-muted-foreground/20 focus:border-primary focus:ring-primary/30"
                                />
                              )}
                            />
                            {errors.sessions?.[index]?.speaker
                              ?.contactEmail && (
                              <p className="text-destructive text-sm">
                                {
                                  errors.sessions[index]?.speaker?.contactEmail
                                    ?.message
                                }
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground/80">Phone</label>
                            <Controller
                              name={`sessions.${index}.speaker.contactPhoneNo`}
                              control={control}
                              render={({ field }) => (
                                <Input
                                  placeholder="+1 (555) 123-4567"
                                  {...field}
                                  className="border-muted-foreground/20 focus:border-primary focus:ring-primary/30"
                                />
                              )}
                            />
                            {errors.sessions?.[index]?.speaker
                              ?.contactPhoneNo && (
                              <p className="text-destructive text-sm">
                                {
                                  errors.sessions[index]?.speaker
                                    ?.contactPhoneNo?.message
                                }
                              </p>
                            )}
                          </div>

                          <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-foreground/80">
                              Description
                            </label>
                            <Controller
                              name={`sessions.${index}.speaker.description`}
                              control={control}
                              render={({ field }) => (
                                <Textarea
                                  placeholder="Speaker bio"
                                  {...field}
                                  className="border-muted-foreground/20 focus:border-primary focus:ring-primary/30"
                                />
                              )}
                            />
                            {errors.sessions?.[index]?.speaker?.description && (
                              <p className="text-destructive text-sm">
                                {
                                  errors.sessions[index]?.speaker?.description
                                    ?.message
                                }
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground/80">
                              LinkedIn
                            </label>
                            <Controller
                              name={`sessions.${index}.speaker.linkedinLink`}
                              control={control}
                              render={({ field }) => (
                                <Input
                                  placeholder="https://linkedin.com/in/..."
                                  {...field}
                                  className="border-muted-foreground/20 focus:border-primary focus:ring-primary/30"
                                />
                              )}
                            />
                            {errors.sessions?.[index]?.speaker
                              ?.linkedinLink && (
                              <p className="text-destructive text-sm">
                                {
                                  errors.sessions[index]?.speaker?.linkedinLink
                                    ?.message
                                }
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground/80">
                              Facebook
                            </label>
                            <Controller
                              name={`sessions.${index}.speaker.facebookLink`}
                              control={control}
                              render={({ field }) => (
                                <Input
                                  placeholder="https://facebook.com/..."
                                  {...field}
                                  className="border-muted-foreground/20 focus:border-primary focus:ring-primary/30"
                                />
                              )}
                            />
                            {errors.sessions?.[index]?.speaker
                              ?.facebookLink && (
                              <p className="text-destructive text-sm">
                                {
                                  errors.sessions[index]?.speaker?.facebookLink
                                    ?.message
                                }
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground/80">
                              Instagram
                            </label>
                            <Controller
                              name={`sessions.${index}.speaker.instagramLink`}
                              control={control}
                              render={({ field }) => (
                                <Input
                                  placeholder="https://instagram.com/..."
                                  {...field}
                                  className="border-muted-foreground/20 focus:border-primary focus:ring-primary/30"
                                />
                              )}
                            />
                            {errors.sessions?.[index]?.speaker
                              ?.instagramLink && (
                              <p className="text-destructive text-sm">
                                {
                                  errors.sessions[index]?.speaker?.instagramLink
                                    ?.message
                                }
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}

              <Button
                type="button"
                variant="outline"
                className="w-full border-primary/30 text-primary hover:bg-primary/10"
                onClick={() =>
                  append({
                    endDate: new Date().toISOString(),
                    location: "",
                    price: 0,
                    queueNo: 0,
                    speaker: {
                      contactEmail: "",
                      contactPhoneNo: "",
                      description: "",
                      facebookLink: "",
                      fullName: "",
                      instagramLink: "",
                      linkedinLink: "",
                    },
                    startDate: new Date().toISOString(),
                  })
                }
              >
                <Plus className="h-4 w-4 mr-2" /> Add Another Session
              </Button>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="px-6 pb-6 pt-2 border-t bg-muted/10">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="border-muted-foreground/30 hover:bg-muted/20"
            >
              Cancel
            </Button>

            {activeTab === "basics" ? (
              <Button 
                type="button" 
                onClick={() => setActiveTab("details")}
                className="bg-primary hover:bg-primary/90"
              >
                Next: Details & Tags
              </Button>
            ) : activeTab === "details" ? (
              <Button 
                type="button" 
                onClick={() => setActiveTab("sessions")}
                className="bg-primary hover:bg-primary/90"
              >
                Next: Sessions
              </Button>
            ) : (
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90"
              >
                {isLoading ? "Creating Event..." : "Create Event"}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
