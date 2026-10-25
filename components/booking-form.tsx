"use client";

import { FormEvent, useState, useSyncExternalStore } from "react";
import { addDays, addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isAfter, isSameMonth, isWeekend, startOfMonth, startOfWeek } from "date-fns";
import { ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, Phone, Video } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getAttribution } from "@/lib/client-attribution";
import { trackEvent } from "@/components/analytics";
import { callRequestService } from "@/lib/validation";

const meetingTypes = [["Microsoft Teams", Video], ["Zoom", Video], ["Google Meet", Video], ["Phone call", Phone]] as const;
const times = ["20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00"];
const weekdays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
// Requests open from tomorrow, on weekdays, up to six weeks ahead.
const bookingWindowDays = 42;

// The page is prerendered, so "today" must come from the visitor's browser, never the build.
const subscribe = () => () => {};
const browserToday = () => format(new Date(), "yyyy-MM-dd");
const serverToday = () => "";

export function BookingForm() {
  const today = useSyncExternalStore(subscribe, browserToday, serverToday);
  const [monthOffset, setMonthOffset] = useState(0);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [meetingType, setMeetingType] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [requested, setRequested] = useState("");
  const [fields, setFields] = useState<Record<string, string[]>>({});

  function clearError(key: string) {
    setFields((current) => Object.fromEntries(Object.entries(current).filter(([name]) => name !== key)));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setStatus("loading");
    setFields({});
    setMessage("");

    const form = event.currentTarget;
    const data = new FormData(form);
    const text = (name: string) => String(data.get(name) ?? "").trim();

    const missing: Record<string, string[]> = {};
    if (!date) missing.meetingDate = ["Choose a day"];
    if (!time) missing.meetingTime = ["Choose a time"];
    if (!meetingType) missing.meetingType = ["Choose how we should meet"];
    if (meetingType === "Phone call" && !text("phone")) missing.phone = ["Add the number we should call"];
    if (Object.keys(missing).length) {
      setFields(missing);
      setStatus("error");
      setMessage("Please check the highlighted fields.");
      return;
    }

    const when = `${format(new Date(`${date}T00:00`), "EEEE d MMMM yyyy")} at ${time} (Cyprus time)`;

    const summary = [
      "Call request",
      `Requested time: ${when}`,
      `Meeting type: ${meetingType}`,
      text("notes") ? `\nWhat they would like to discuss:\n${text("notes")}` : "",
    ].filter(Boolean).join("\n");

    const payload = {
      name: text("name"),
      businessName: text("businessName"),
      email: text("email"),
      phone: text("phone"),
      service: callRequestService,
      requestedTime: when,
      meetingType,
      message: summary,
      companyWebsite: data.get("companyWebsite"),
      ...getAttribution(),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as { message?: string; fields?: Record<string, string[]> };

      if (!response.ok) {
        setFields(result.fields ?? {});
        throw new Error(result.message ?? "We could not send your request.");
      }

      form.reset();
      setStatus("success");
      setRequested(when);

      trackEvent("generate_lead", { lead_type: "call_request" });
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="form-success booking-success" role="status">
        <CheckCircle2 />
        <p className="eyebrow">Request received</p>
        <h2>Thank you. We will confirm your call shortly.</h2>
        <p>You asked for {meetingType === "Phone call" ? "a phone call" : `a ${meetingType} call`} on {requested}. We check the time and confirm it with you by email or phone. If that slot is taken, we suggest the nearest free one.</p>
        <button className="text-link" onClick={() => { setStatus("idle"); setDate(""); setTime(""); setMeetingType(""); setRequested(""); }}>
          Request another time
        </button>
      </div>
    );
  }

  return (
    <form className="site-form booking-form" onSubmit={submit} noValidate>
      <fieldset className="form-step">
        <legend><span>01</span> Pick a day and time</legend>
        <div className="booking-when">
          {today ? <MonthGrid today={today} offset={monthOffset} onOffset={setMonthOffset} selected={date} onSelect={(day) => { setDate(day); clearError("meetingDate"); }} /> : <div className="booking-calendar booking-calendar-loading" aria-hidden="true" />}
          <div className="booking-times">
            <p>{date ? format(new Date(`${date}T00:00`), "EEEE d MMMM") : "Choose a day first"}</p>
            <div role="group" aria-label="Available times">
              {times.map((slot) => (
                <button type="button" key={slot} className="booking-chip" aria-pressed={time === slot} disabled={!date} onClick={() => { setTime(slot); clearError("meetingTime"); }}>
                  {slot}
                </button>
              ))}
            </div>
            <small>Cyprus time, Monday to Friday.</small>
          </div>
        </div>
        <FieldError value={fields.meetingDate?.[0] ?? fields.meetingTime?.[0]} />
      </fieldset>

      <fieldset className="form-step">
        <legend><span>02</span> How should we meet?</legend>
        <div className="booking-types" role="group" aria-label="Meeting type">
          {meetingTypes.map(([label, Icon]) => (
            <button type="button" key={label} className="booking-type" aria-pressed={meetingType === label} onClick={() => { setMeetingType(label); clearError("meetingType"); }}>
              <Icon aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
        <FieldError value={fields.meetingType?.[0]} />
      </fieldset>

      <fieldset className="form-step">
        <legend><span>03</span> Your details</legend>
        <p className="form-required-note">
          Fields marked <strong>*</strong> are required.
        </p>
        <div className="form-row">
          <Field label="Name" name="name" required autoComplete="name" error={fields.name?.[0]} />
          <Field label="Business name" name="businessName" required autoComplete="organization" error={fields.businessName?.[0]} />
        </div>
        <div className="form-row">
          <Field label="Email" name="email" type="email" required autoComplete="email" error={fields.email?.[0]} />
          <Field label="Phone" name="phone" type="tel" required={meetingType === "Phone call"} autoComplete="tel" error={fields.phone?.[0]} />
        </div>
        <div className="form-field">
          <Label htmlFor="booking-notes">What would you like to talk about?</Label>
          <Textarea id="booking-notes" name="notes" rows={4} placeholder="A new website, more enquiries, Google visibility..." />
        </div>
      </fieldset>

      <div className="honeypot" aria-hidden="true">
        <label>
          Company website
          <input name="companyWebsite" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {status === "error" && (
        <p className="form-error-banner" role="alert">
          {message}
        </p>
      )}

      <button className="button button-accent button-large form-submit" type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Sending..." : <>Request This Time <ArrowRight /></>}
      </button>
    </form>
  );
}

function MonthGrid({ today, offset, onOffset, selected, onSelect }: { today: string; offset: number; onOffset: (offset: number) => void; selected: string; onSelect: (day: string) => void }) {
  const first = addDays(new Date(`${today}T00:00`), 1);
  const last = addDays(first, bookingWindowDays - 1);
  const month = addMonths(startOfMonth(first), offset);
  const canGoBack = offset > 0;
  const canGoForward = isAfter(startOfMonth(last), month);
  const days = eachDayOfInterval({ start: startOfWeek(month, { weekStartsOn: 1 }), end: endOfWeek(endOfMonth(month), { weekStartsOn: 1 }) });
  const isOpen = (day: Date) => !isWeekend(day) && !isAfter(first, day) && !isAfter(day, last);

  return (
    <div className="booking-calendar">
      <div className="booking-calendar-head">
        <button type="button" onClick={() => onOffset(offset - 1)} disabled={!canGoBack} aria-label="Previous month"><ChevronLeft /></button>
        <strong aria-live="polite">{format(month, "MMMM yyyy")}</strong>
        <button type="button" onClick={() => onOffset(offset + 1)} disabled={!canGoForward} aria-label="Next month"><ChevronRight /></button>
      </div>
      <div className="booking-calendar-grid">
        {weekdays.map((day) => <span key={day} className="booking-weekday" aria-hidden="true">{day}</span>)}
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          if (!isSameMonth(day, month)) return <span key={key} />;
          return (
            <button type="button" key={key} className="booking-day" disabled={!isOpen(day)} aria-pressed={selected === key} aria-label={format(day, "EEEE d MMMM")} onClick={() => onSelect(key)}>
              {format(day, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  error?: string;
}) {
  return (
    <div className="form-field">
      <Label htmlFor={name}>
        {label}
        {required ? " *" : ""}
      </Label>
      <Input id={name} name={name} type={type} required={required} autoComplete={autoComplete} aria-invalid={Boolean(error)} />
      <FieldError value={error} />
    </div>
  );
}

function FieldError({ value }: { value?: string }) {
  return value ? (
    <p className="field-error" role="alert">
      {value}
    </p>
  ) : null;
}
