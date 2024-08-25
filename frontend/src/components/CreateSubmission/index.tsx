'use client';

import WhiteAddLogo from '@/assets/common/WhiteAddLogo.svg';
import { getLocalTimeZone, today } from '@internationalized/date';
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { DatePicker } from '@nextui-org/react';
import Image from 'next/image';
import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { Submission } from '../CreateSubmissionFlow';
import styles from './index.module.scss';

interface CreateSubmissionProps {
  submissions: Submission[];
  setSubmissions: Dispatch<SetStateAction<Submission[]>>;
  isStudy?: boolean;
}

const CreateSubmission: React.FC<CreateSubmissionProps> = ({ submissions, setSubmissions, isStudy = false }) => {
  const handleInputChange = (index: number, field: keyof Submission, value: string) => {
    const updatedSubmissions = submissions.map((submission, i) =>
      i === index ? { ...submission, [field]: value } : submission,
    );
    setSubmissions(updatedSubmissions);
  };

  const addSubmissionForm = () => {
    setSubmissions([...submissions, { title: '', content: '', type: 'article', endTime: '' }]);
  };

  return (
    <div className={styles.container}>
      <button className={styles.addBtn} onClick={addSubmissionForm}>
        <Image className={styles.addImg} src={WhiteAddLogo.src} alt="logo" width={24} height={24} /> Submission
      </button>
      {submissions.map((submission, index) => (
        <div key={index} className={styles.submissionContainer}>
          <div className={styles.inputWrapper}>
            Title
            <input
              type="text"
              className={styles.input}
              placeholder="Title of submission"
              value={submission.title}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(index, 'title', e.target.value)}
            />
          </div>
          <div className={styles.inputWrapper}>
            Content
            <textarea
              className={styles.input}
              placeholder="Content of submission"
              value={submission.content}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleInputChange(index, 'content', e.target.value)}
            />
          </div>
          {isStudy && (
            <div className={styles.inputWrapper}>
              Type
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name={`row-radio-buttons-group-${index}`}
                value={submission.type} // Set the current value
                onChange={(e) => handleInputChange(index, 'type', e.target.value)}
              >
                <FormControlLabel value="article" control={<Radio />} label="Article" />
                <FormControlLabel value="mission" control={<Radio />} label="Mission" />
              </RadioGroup>
            </div>
          )}
          <div className={styles.inputWrapper}>
            Deadline
            <DatePicker
              aria-label="program-period"
              size="sm"
              lang="en"
              hourCycle={24}
              variant="underlined"
              visibleMonths={3}
              minValue={today(getLocalTimeZone())}
              onChange={(e) => {
                handleInputChange(
                  index,
                  'endTime',
                  `${e.year}-${e.month >= 10 ? e.month : `0${e.month}`}-${e.day} 00:00:00`,
                );
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CreateSubmission;
