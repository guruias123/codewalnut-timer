import { describe, it, expect, vi, beforeAll } from "vitest";
import { validateTimerForm } from "../utils/validation";
import { toast } from "sonner";

// Mock the toast function to prevent actual UI interactions
vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

beforeAll(() => {
    (globalThis as any).window = { innerWidth: 1024 };
  });
  
  

describe("validateTimerForm", () => {
  it("should return false if title is empty", () => {
    const formData = { title: "", description: "", hours: 0, minutes: 0, seconds: 1 };
    const result = validateTimerForm(formData);
    expect(result).toBe(false);
    expect(toast.error).toHaveBeenCalledWith("Title is required", expect.any(Object));
  });

  it("should return false if title exceeds 50 characters", () => {
    const formData = { title: "A".repeat(51), description: "", hours: 0, minutes: 0, seconds: 1 };
    const result = validateTimerForm(formData);
    expect(result).toBe(false);
    expect(toast.error).toHaveBeenCalledWith("Title must be less than 50 characters", expect.any(Object));
  });

  it("should return false if time values are negative", () => {
    const formData = { title: "Valid Title", description: "", hours: -1, minutes: 10, seconds: 5 };
    const result = validateTimerForm(formData);
    expect(result).toBe(false);
    expect(toast.error).toHaveBeenCalledWith("Time values cannot be negative", expect.any(Object));
  });

  it("should return false if minutes or seconds exceed 59", () => {
    const formData = { title: "Valid Title", description: "", hours: 0, minutes: 60, seconds: 10 };
    const result = validateTimerForm(formData);
    expect(result).toBe(false);
    expect(toast.error).toHaveBeenCalledWith("Minutes and seconds must be between 0 and 59", expect.any(Object));
  });

  it("should return false if total time is zero", () => {
    const formData = { title: "Valid Title", description: "", hours: 0, minutes: 0, seconds: 0 };
    const result = validateTimerForm(formData);
    expect(result).toBe(false);
    expect(toast.error).toHaveBeenCalledWith("Please set a time greater than 0", expect.any(Object));
  });

  it("should return false if timer exceeds 24 hours", () => {
    const formData = { title: "Valid Title", description: "", hours: 25, minutes: 0, seconds: 0 };
    const result = validateTimerForm(formData);
    expect(result).toBe(false);
    expect(toast.error).toHaveBeenCalledWith("Timer cannot exceed 24 hours", expect.any(Object));
  });
});
