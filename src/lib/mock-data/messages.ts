import type { Message, MessageThread } from '@/types';

// ============================================================================
// Mock Message Threads
// ============================================================================

export const messageThreads: MessageThread[] = [
  {
    id: 'thread1',
    participants: ['s1', 't1'],
    subject: 'Help with Algebra II Homework',
    lastMessage: 'Thanks, Dr. Smith! That makes a lot more sense now.',
    lastMessageAt: '2026-03-08T16:45:00Z',
    unreadCount: 0,
  },
  {
    id: 'thread2',
    participants: ['s1', 't2'],
    subject: 'Feedback on Shakespeare Essay Draft',
    lastMessage: 'I will revise the thesis and resubmit by Friday.',
    lastMessageAt: '2026-03-10T09:20:00Z',
    unreadCount: 1,
  },
  {
    id: 'thread3',
    participants: ['p1', 't1'],
    subject: "Sarah's Progress in Algebra II",
    lastMessage: 'Thank you for the update. We will make sure she keeps up the practice at home.',
    lastMessageAt: '2026-03-09T19:30:00Z',
    unreadCount: 0,
  },
  {
    id: 'thread4',
    participants: ['t1', 'a1'],
    subject: 'Spring Semester Curriculum Review',
    lastMessage: 'I have attached the updated pacing guide. Let me know if it aligns with the board goals.',
    lastMessageAt: '2026-03-07T14:10:00Z',
    unreadCount: 1,
  },
  {
    id: 'thread5',
    participants: ['p2', 't3'],
    subject: 'Lab Safety Concern — AP Chemistry',
    lastMessage: 'We have already ordered additional safety goggles and they should arrive this week.',
    lastMessageAt: '2026-03-11T11:00:00Z',
    unreadCount: 0,
  },
];

// ============================================================================
// Mock Messages
// ============================================================================

export const messages: Message[] = [
  // ---------------------------------------------------------------------------
  // Thread 1 — s1 (Sarah Chen) & t1 (Dr. Robert Smith): Math homework
  // ---------------------------------------------------------------------------
  {
    id: 'msg1',
    senderId: 's1',
    receiverId: 't1',
    threadId: 'thread1',
    content:
      'Hi Dr. Smith, I am stuck on problems 16-18 from the polynomial worksheet. I do not understand how to apply synthetic division when the divisor is not in the form (x - c). Could you explain?',
    timestamp: '2026-03-08T14:00:00Z',
    read: true,
  },
  {
    id: 'msg2',
    senderId: 't1',
    receiverId: 's1',
    threadId: 'thread1',
    content:
      'Great question, Sarah. When the divisor is something like (2x - 3), you first factor out the leading coefficient so it becomes 2(x - 3/2). Then apply synthetic division with c = 3/2 and remember to divide the final result by 2. Does that help?',
    timestamp: '2026-03-08T15:20:00Z',
    read: true,
  },
  {
    id: 'msg3',
    senderId: 's1',
    receiverId: 't1',
    threadId: 'thread1',
    content:
      'Oh, I see! So I need to adjust for the leading coefficient separately. Let me try reworking those problems.',
    timestamp: '2026-03-08T16:00:00Z',
    read: true,
  },
  {
    id: 'msg4',
    senderId: 's1',
    receiverId: 't1',
    threadId: 'thread1',
    content: 'Thanks, Dr. Smith! That makes a lot more sense now.',
    timestamp: '2026-03-08T16:45:00Z',
    read: true,
  },

  // ---------------------------------------------------------------------------
  // Thread 2 — s1 (Sarah Chen) & t2 (Prof. Lisa Wang): Essay feedback
  // ---------------------------------------------------------------------------
  {
    id: 'msg5',
    senderId: 't2',
    receiverId: 's1',
    threadId: 'thread2',
    content:
      'Hi Sarah, I have read through your Shakespeare essay draft. Your analysis of fate in Romeo and Juliet is interesting, but the thesis needs to be more specific. Right now it reads as a summary rather than an argument. Try narrowing your focus to a single aspect of fate — for example, how the prologue frames audience expectations.',
    timestamp: '2026-03-09T10:00:00Z',
    read: true,
  },
  {
    id: 'msg6',
    senderId: 's1',
    receiverId: 't2',
    threadId: 'thread2',
    content:
      'Thank you for the feedback, Prof. Wang. So you are saying I should pick one element of fate and build my argument around that instead of covering everything broadly?',
    timestamp: '2026-03-09T18:30:00Z',
    read: true,
  },
  {
    id: 'msg7',
    senderId: 't2',
    receiverId: 's1',
    threadId: 'thread2',
    content:
      'Exactly. A focused thesis will give you room for deeper analysis and stronger textual evidence. I would also suggest looking at Act 3, Scene 1 as a turning point where fate becomes inescapable.',
    timestamp: '2026-03-10T08:15:00Z',
    read: true,
  },
  {
    id: 'msg8',
    senderId: 's1',
    receiverId: 't2',
    threadId: 'thread2',
    content: 'I will revise the thesis and resubmit by Friday.',
    timestamp: '2026-03-10T09:20:00Z',
    read: false,
  },

  // ---------------------------------------------------------------------------
  // Thread 3 — p1 (David Chen) & t1 (Dr. Robert Smith): Child's progress
  // ---------------------------------------------------------------------------
  {
    id: 'msg9',
    senderId: 'p1',
    receiverId: 't1',
    threadId: 'thread3',
    content:
      'Good evening, Dr. Smith. I wanted to check in on Sarah\'s progress in Algebra II. She mentioned the material is getting more challenging this semester. Are there areas where she could improve?',
    timestamp: '2026-03-09T17:00:00Z',
    read: true,
  },
  {
    id: 'msg10',
    senderId: 't1',
    receiverId: 'p1',
    threadId: 'thread3',
    content:
      'Hello Mr. Chen. Sarah is doing very well overall — she earned a 93% on the last quiz and actively participates in class. The polynomial unit is definitely more demanding, but she has been coming to office hours which is great. I would recommend she continue practicing synthetic division at home.',
    timestamp: '2026-03-09T18:45:00Z',
    read: true,
  },
  {
    id: 'msg11',
    senderId: 'p1',
    receiverId: 't1',
    threadId: 'thread3',
    content:
      'That is reassuring to hear. Is there a specific resource or practice set you would recommend for home study?',
    timestamp: '2026-03-09T19:10:00Z',
    read: true,
  },
  {
    id: 'msg12',
    senderId: 'p1',
    receiverId: 't1',
    threadId: 'thread3',
    content:
      'Thank you for the update. We will make sure she keeps up the practice at home.',
    timestamp: '2026-03-09T19:30:00Z',
    read: true,
  },

  // ---------------------------------------------------------------------------
  // Thread 4 — t1 (Dr. Robert Smith) & a1 (Principal Tom Henderson): Curriculum
  // ---------------------------------------------------------------------------
  {
    id: 'msg13',
    senderId: 'a1',
    receiverId: 't1',
    threadId: 'thread4',
    content:
      'Dr. Smith, the board has asked for an updated pacing guide for the spring semester math courses. Could you send over your revised plan by end of this week? We want to ensure we are on track for the state assessments in May.',
    timestamp: '2026-03-06T09:00:00Z',
    read: true,
  },
  {
    id: 'msg14',
    senderId: 't1',
    receiverId: 'a1',
    threadId: 'thread4',
    content:
      'Of course, Principal Henderson. I have been adjusting the Algebra II pacing to spend an extra week on polynomials since several students needed more time. I will have the document ready by Thursday.',
    timestamp: '2026-03-06T11:30:00Z',
    read: true,
  },
  {
    id: 'msg15',
    senderId: 'a1',
    receiverId: 't1',
    threadId: 'thread4',
    content:
      'That sounds reasonable. Please also include how the Calculus I course is tracking. The district wants to see AP readiness metrics this year.',
    timestamp: '2026-03-07T08:45:00Z',
    read: true,
  },
  {
    id: 'msg16',
    senderId: 't1',
    receiverId: 'a1',
    threadId: 'thread4',
    content:
      'I have attached the updated pacing guide. Let me know if it aligns with the board goals.',
    timestamp: '2026-03-07T14:10:00Z',
    read: false,
    attachments: ['/uploads/spring-2026-math-pacing-guide.pdf'],
  },

  // ---------------------------------------------------------------------------
  // Thread 5 — p2 (Patricia Johnson) & t3 (Mr. James Brown): Lab safety
  // ---------------------------------------------------------------------------
  {
    id: 'msg17',
    senderId: 'p2',
    receiverId: 't3',
    threadId: 'thread5',
    content:
      'Mr. Brown, Marcus mentioned that during the titration lab last week, one of the students spilled acid because there were not enough safety goggles to go around and some students were sharing. I am concerned about safety in the chemistry lab. Can you tell me more about what happened?',
    timestamp: '2026-03-10T20:00:00Z',
    read: true,
  },
  {
    id: 'msg18',
    senderId: 't3',
    receiverId: 'p2',
    threadId: 'thread5',
    content:
      'Thank you for reaching out, Mrs. Johnson. I understand your concern completely. The spill was very minor and was cleaned up immediately following our safety protocol. You are right that we were short on goggles that day — two pairs broke during the previous period. I have already reported this to administration and requested replacements.',
    timestamp: '2026-03-11T08:30:00Z',
    read: true,
  },
  {
    id: 'msg19',
    senderId: 'p2',
    receiverId: 't3',
    threadId: 'thread5',
    content:
      'I appreciate the quick response. When do you expect the new equipment to arrive? I just want to make sure Marcus is safe during the next lab.',
    timestamp: '2026-03-11T10:15:00Z',
    read: true,
  },
  {
    id: 'msg20',
    senderId: 't3',
    receiverId: 'p2',
    threadId: 'thread5',
    content:
      'We have already ordered additional safety goggles and they should arrive this week.',
    timestamp: '2026-03-11T11:00:00Z',
    read: true,
  },
];

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Return every thread in which the given user is a participant.
 */
export function getThreadsByUser(userId: string): MessageThread[] {
  return messageThreads.filter((thread) => thread.participants.includes(userId));
}

/**
 * Return every message that belongs to the given thread, sorted by timestamp.
 */
export function getMessagesByThread(threadId: string): Message[] {
  return messages
    .filter((message) => message.threadId === threadId)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}
