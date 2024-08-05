import { ChapterType } from './chapter';
import { MissionType } from './mission';
import { SubmissionType } from './submission';

interface ParsingChaptersType extends ChapterType {
  submissions?: SubmissionType[];
}

export interface ParsingMissionType extends MissionType {
  chapters?: ParsingChaptersType[];
  submissions?: SubmissionType[];
}
