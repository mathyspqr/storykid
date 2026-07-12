"use client";
import { useEffect } from "react";
import { track, type StoryKidEvent } from "@/lib/analytics";
export function AnalyticsView({event}:{event:StoryKidEvent}){useEffect(()=>{track(event)},[event]);return null}
