
export interface Feature {
  icon: string;
  text: string;
  color: string;
}

export interface OnboardingType {
  id: number;
  title: string;
  description: string;
  image: string;
  buttonText: string;
  showIcon?: boolean;
  iconType?: 'map' | 'pin';
  showSkipHeader?: boolean;
  features?: Feature[];
  showLocationIcon?: boolean;
  showSecondaryButton?: boolean;
  secondaryButtonText?: string;
}
