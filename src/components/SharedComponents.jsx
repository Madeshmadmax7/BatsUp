import React from "react";
import { RefreshCw, AlertCircle } from "lucide-react";

// Utility function
export function clsx(...parts) {
    return parts.filter(Boolean).join(" ");
}

// Section wrapper component
export function Section({ title, children, right }) {
    return (
        <section className="bg-gray-900/40 rounded-2xl border border-gray-800 p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-5">
                <h2 className="text-2xl font-semibold">{title}</h2>
                {right}
            </div>
            {children}
        </section>
    );
}

// Inline spinner component
export function InlineSpinner({ label }) {
    return (
        <span className="inline-flex items-center gap-2 text-sm text-gray-300">
            <RefreshCw className="animate-spin" size={16} />
            {label || "Loading..."}
        </span>
    );
}

// Empty state component
export function Empty({ children }) {
    return <p className="text-gray-400 italic">{children}</p>;
}

// Error note component
export function ErrorNote({ message }) {
    if (!message) return null;
    return (
        <div className="flex items-start gap-2 text-rose-300 bg-rose-900/20 border border-rose-800 rounded-lg p-3 mb-4">
            <AlertCircle size={18} className="mt-0.5" />
            <div className="text-sm leading-5">{message}</div>
        </div>
    );
}