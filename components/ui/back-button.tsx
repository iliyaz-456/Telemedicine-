'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BackButtonProps {
  /**
   * The text to display on the button
   * @default "Back"
   */
  text?: string;
  
  /**
   * The destination route to navigate to
   * If not provided, will use browser history (router.back())
   */
  to?: string;
  
  /**
   * Additional CSS classes for styling
   */
  className?: string;
  
  /**
   * Whether to show a loading spinner during navigation
   * @default true
   */
  showLoading?: boolean;
  
  /**
   * Custom click handler (overrides default navigation)
   */
  onClick?: () => void;
  
  /**
   * Whether the button should be disabled
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Size variant of the button
   * @default "default"
   */
  size?: 'sm' | 'default' | 'lg';
  
  /**
   * Variant of the button
   * @default "outline"
   */
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

/**
 * Reusable BackButton component for navigation
 * 
 * Features:
 * - Browser history navigation (router.back()) or custom route navigation
 * - Loading state with spinner during navigation
 * - Customizable text, styling, and behavior
 * - Responsive design with hover effects
 * - Error handling for navigation failures
 * 
 * Usage Examples:
 * - <BackButton /> - Uses browser history
 * - <BackButton to="/dashboard/patient" text="Back to Dashboard" />
 * - <BackButton onClick={handleCustomAction} text="Cancel" />
 */
export default function BackButton({
  text = 'Back',
  to,
  className,
  showLoading = true,
  onClick,
  disabled = false,
  size = 'default',
  variant = 'outline'
}: BackButtonProps) {
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();

  /**
   * Handles the back button click
   * - If custom onClick is provided, executes it
   * - If 'to' prop is provided, navigates to that route
   * - Otherwise, uses browser history (router.back())
   */
  const handleBackClick = async () => {
    try {
      // Execute custom click handler if provided
      if (onClick) {
        onClick();
        return;
      }

      // Show loading state if enabled
      if (showLoading) {
        setIsNavigating(true);
        
        // Small delay for smooth UX
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // Navigate based on props
      if (to) {
        router.push(to);
      } else {
        // Use browser history
        router.back();
      }
    } catch (error) {
      console.error('Navigation error:', error);
      
      // Reset loading state on error
      if (showLoading) {
        setIsNavigating(false);
      }
      
      // Show user-friendly error message
      alert('Navigation failed. Please try again.');
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleBackClick}
      disabled={disabled || isNavigating}
      className={cn(
        'flex items-center gap-2 transition-all duration-200 hover:scale-105',
        'hover:shadow-md active:scale-95',
        className
      )}
    >
      {isNavigating && showLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <ArrowLeft className="h-4 w-4" />
      )}
      <span className="hidden sm:inline">{text}</span>
    </Button>
  );
}

/**
 * Specialized BackButton for dashboard navigation
 * Pre-configured for "Back to Dashboard" functionality
 */
export function BackToDashboardButton({ 
  userRole, 
  className 
}: { 
  userRole: 'Patient' | 'Doctor' | 'Worker';
  className?: string;
}) {
  const getDashboardRoute = (role: string) => {
    switch (role) {
      case 'Patient':
        return '/dashboard/patient';
      case 'Doctor':
        return '/dashboard/doctor';
      case 'Worker':
        return '/dashboard/worker';
      default:
        return '/dashboard';
    }
  };

  return (
    <BackButton
      text="Back to Dashboard"
      to={getDashboardRoute(userRole)}
      className={cn('bg-primary/10 hover:bg-primary/20 text-primary', className)}
    />
  );
}
