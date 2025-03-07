import { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { EventPayload, FullEventSchema } from "@/api/schemas/eventSchema";
import { Clock, MapPin, Tag, Users, Plus, X, ChevronDown, ChevronUp, Calendar, ArrowLeft } from 'lucide-react';

const AddEvent = () => {
  const { mutate, isLoading } = useCreateEvent();
  const userData = useSelector(selectUserData);
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
    resolver: zodResolver(FullEventSchema),
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
 
      },
      onError: (error) => {
        console.error("Failed to create event:", error);
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
    {/* Header */}
    <header className="bg-white border-b border-gray-200  top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className="mr-4 text-gray-500 hover:text-gray-700"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Calendar className="h-6 w-6 mr-2 text-primary" />
              Create New Event
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => reset()}
            
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
       
            >
              {isLoading ? "Creating Event..." : "Create Event"}
            </Button>
          </div>
        </div>
      </div>
    </header>

    {/* Main Content */}
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full max-w-2xl mx-auto bg-white p-1 border border-gray-200 rounded-lg">
            <TabsTrigger
              value="basics"
              className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              Basic Info
            </TabsTrigger>
            <TabsTrigger
              value="details"
              className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              Details & Tags
            </TabsTrigger>
            <TabsTrigger
              value="sessions"
              className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              Sessions
            </TabsTrigger>
          </TabsList>

          <div className="mt-8">
            <TabsContent value="basics" className="space-y-8">
              <Card className="bg-white shadow-sm">
                <CardHeader className="bg-gray-50/50 border-b">
                  <CardTitle className="text-xl text-gray-900 flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-primary" />
                    Event Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Event Name
                      </label>
                      <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                          <Input
                            placeholder="Event Name"
                            {...field}
                            className="border-gray-300 focus:border-primary focus:ring-primary/30"
                          />
                        )}
                      />
                      {errors.name && (
                        <p className="text-destructive text-sm">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Event Type
                      </label>
                      <Controller
                        name="eventType"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="border-gray-300 focus:ring-primary/30">
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
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <Textarea
                          placeholder="Provide a detailed description of the event"
                          className="min-h-[120px] border-gray-300 focus:border-primary focus:ring-primary/30"
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
                      <label className="text-sm font-medium text-gray-700">
                        Privacy
                      </label>
                      <Controller
                        name="eventPrivacyType"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="border-gray-300 focus:ring-primary/30">
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

              <Card className="bg-white shadow-sm">
                <CardHeader className="bg-gray-50/50 border-b">
                  <CardTitle className="text-xl text-gray-900 flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-primary" />
                    Time & Location
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center text-gray-700">
                        <Clock className="h-4 w-4 mr-2 text-primary/70" /> Start
                        Time
                      </label>
                      <Controller
                        name="startTime"
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="datetime-local"
                            {...field}
                            className="border-gray-300 focus:border-primary focus:ring-primary/30"
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
                      <label className="text-sm font-medium flex items-center text-gray-700">
                        <Clock className="h-4 w-4 mr-2 text-primary/70" /> End
                        Time
                      </label>
                      <Controller
                        name="endTime"
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="datetime-local"
                            {...field}
                            className="border-gray-300 focus:border-primary focus:ring-primary/30"
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
                      <label className="text-sm font-medium flex items-center text-gray-700">
                        <MapPin className="h-4 w-4 mr-2 text-primary/70" />{" "}
                        Location
                      </label>
                      <Controller
                        name="location"
                        control={control}
                        render={({ field }) => (
                          <Input
                            placeholder="Event location"
                            {...field}
                            className="border-gray-300 focus:border-primary focus:ring-primary/30"
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
                      <label className="text-sm font-medium text-gray-700">
                        Location Link
                      </label>
                      <Controller
                        name="locationLink"
                        control={control}
                        render={({ field }) => (
                          <Input
                            placeholder="https://..."
                            {...field}
                            className="border-gray-300 focus:border-primary focus:ring-primary/30"
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

            <TabsContent value="details" className="space-y-8">
              <Card className="bg-white shadow-sm">
                <CardHeader className="bg-gray-50/50 border-b">
                  <CardTitle className="text-xl text-gray-900 flex items-center">
                    <Users className="mr-2 h-5 w-5 text-primary" />
                    Additional Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center text-gray-700">
                      <Users className="h-4 w-4 mr-2 text-primary/70" /> Maximum
                      Attendees
                    </label>
                    <Controller
                      name="maxAttendeeCount"
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(e.target.valueAsNumber)}
                          className="border-gray-300 focus:border-primary focus:ring-primary/30"
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
                    <label className="text-sm font-medium flex items-center text-gray-700">
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
                        className="flex-1 border-gray-300 focus:border-primary focus:ring-primary/30"
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
                        <div className="text-sm text-gray-500 italic">
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

            <TabsContent value="sessions" className="space-y-8">
              {fields.map((field, index) => (
                <Card
                  key={field.id}
                  className="bg-white shadow-sm overflow-hidden"
                >
                  <CardHeader className="py-4 px-6 bg-gray-50/50 border-b">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-xl text-gray-900 flex items-center">
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
                    <CardContent className="p-6 space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Location
                          </label>
                          <Controller
                            name={`sessions.${index}.location`}
                            control={control}
                            render={({ field }) => (
                              <Input
                                placeholder="Session location"
                                {...field}
                                className="border-gray-300 focus:border-primary focus:ring-primary/30"
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
                          <label className="text-sm font-medium text-gray-700">
                            Price
                          </label>
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
                                className="border-gray-300 focus:border-primary focus:ring-primary/30"
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
                          <label className="text-sm font-medium text-gray-700">
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
                                className="border-gray-300 focus:border-primary focus:ring-primary/30"
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

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Start Date
                          </label>
                          <Controller
                            name={`sessions.${index}.startDate`}
                            control={control}
                            render={({ field }) => (
                              <Input
                                type="datetime-local"
                                {...field}
                                className="border-gray-300 focus:border-primary focus:ring-primary/30"
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
                          <label className="text-sm font-medium text-gray-700">
                            End Date
                          </label>
                          <Controller
                            name={`sessions.${index}.endDate`}
                            control={control}
                            render={({ field }) => (
                              <Input
                                type="datetime-local"
                                {...field}
                                className="border-gray-300 focus:border-primary focus:ring-primary/30"
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

                      <Separator className="bg-gray-200" />

                      <div className="space-y-6">
                        <h3 className="font-medium text-lg text-primary">
                          Speaker Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                              Full Name
                            </label>
                            <Controller
                              name={`sessions.${index}.speaker.fullName`}
                              control={control}
                              render={({ field }) => (
                                <Input
                                  placeholder="Speaker name"
                                  {...field}
                                  className="border-gray-300 focus:border-primary focus:ring-primary/30"
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
                            <label className="text-sm font-medium text-gray-700">
                              Email
                            </label>
                            <Controller
                              name={`sessions.${index}.speaker.contactEmail`}
                              control={control}
                              render={({ field }) => (
                                <Input
                                  type="email"
                                  placeholder="speaker@example.com"
                                  {...field}
                                  className="border-gray-300 focus:border-primary focus:ring-primary/30"
                                />
                              )}
                            />
                            {errors.sessions?.[index]?.speaker?.contactEmail && (
                              <p className="text-destructive text-sm">
                                {
                                  errors.sessions[index]?.speaker?.contactEmail
                                    ?.message
                                }
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                              Phone
                            </label>
                            <Controller
                              name={`sessions.${index}.speaker.contactPhoneNo`}
                              control={control}
                              render={({ field }) => (
                                <Input
                                  placeholder="+1 (555) 123-4567"
                                  {...field}
                                  className="border-gray-300 focus:border-primary focus:ring-primary/30"
                                />
                              )}
                            />
                            {errors.sessions?.[index]?.speaker
                              ?.contactPhoneNo && (
                              <p className="text-destructive text-sm">
                                {
                                  errors.sessions[index]?.speaker?.contactPhoneNo
                                    ?.message
                                }
                              </p>
                            )}
                          </div>

                          <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-gray-700">
                              Description
                            </label>
                            <Controller
                              name={`sessions.${index}.speaker.description`}
                              control={control}
                              render={({ field }) => (
                                <Textarea
                                  placeholder="Speaker bio"
                                  {...field}
                                  className="border-gray-300 focus:border-primary focus:ring-primary/30"
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

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                              LinkedIn
                            </label>
                            <Controller
                              name={`sessions.${index}.speaker.linkedinLink`}
                              control={control}
                              render={({ field }) => (
                                <Input
                                  placeholder="https://linkedin.com/in/..."
                                  {...field}
                                  className="border-gray-300 focus:border-primary focus:ring-primary/30"
                                />
                              )}
                            />
                            {errors.sessions?.[index]?.speaker?.linkedinLink && (
                              <p className="text-destructive text-sm">
                                {
                                  errors.sessions[index]?.speaker?.linkedinLink
                                    ?.message
                                }
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                              Facebook
                            </label>
                            <Controller
                              name={`sessions.${index}.speaker.facebookLink`}
                              control={control}
                              render={({ field }) => (
                                <Input
                                  placeholder="https://facebook.com/..."
                                  {...field}
                                  className="border-gray-300 focus:border-primary focus:ring-primary/30"
                                />
                              )}
                            />
                            {errors.sessions?.[index]?.speaker?.facebookLink && (
                              <p className="text-destructive text-sm">
                                {
                                  errors.sessions[index]?.speaker?.facebookLink
                                    ?.message
                                }
                              </p> )}
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                              Instagram
                            </label>
                            <Controller
                              name={`sessions.${index}.speaker.instagramLink`}
                              control={control}
                              render={({ field }) => (
                                <Input
                                  placeholder="https://instagram.com/..."
                                  {...field}
                                  className="border-gray-300 focus:border-primary focus:ring-primary/30"
                                />
                              )}
                            />
                            {errors.sessions?.[index]?.speaker?.instagramLink && (
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
          </div>
        </Tabs>
      </form>
    </main>
  </div>
  );
};


export default AddEvent