export interface Sample {
  title: string;
  tags: string[];
  isFeatured?: boolean;
  description: string;
  url: string;
}

export interface SampleListItemProps {
  sample: Sample;
  onCreateSample: (sample: Sample) => void;
}