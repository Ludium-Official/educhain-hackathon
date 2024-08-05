import { ChapterType } from '@/types/chapter';
import { MissionType } from '@/types/mission';
import { SubmissionType } from '@/types/submission';

export const missionChapterSubmissionParsing = (
  missions: MissionType[],
  chapters: ChapterType[],
  submissions: SubmissionType[],
) => {
  const result = missions.map((mission) => {
    if (mission.category === 'announcement') {
      return {
        ...mission,
        submissions: submissions.filter(
          (submission) => submission.mission_id === mission.id && submission.chapter_id === 0,
        ),
      };
    } else {
      const missionChapters = chapters.filter((chapter) => chapter.mission_id === mission.id);
      return {
        ...mission,
        chapters: missionChapters.map((chapter) => ({
          ...chapter,
          submissions: submissions.filter(
            (submission) => submission.mission_id === mission.id && submission.chapter_id === chapter.id,
          ),
        })),
      };
    }
  });

  return result;
};
