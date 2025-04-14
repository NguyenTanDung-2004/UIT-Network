"use client";
import React, { useEffect, useState } from "react";
interface SearchResultsPageProps {
  params: {
    type: string;
  };
  searchParams: {
    q?: string;
    sort?: string;
    filter?: string;
    friend_status?: string;
    location?: string;
    education?: string;
    hobby?: string;
  };
}
