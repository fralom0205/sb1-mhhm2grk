 # Content Feature Documentation

## Overview

The `Content` feature supports the management of different types of content: `job`, `promotion`, and `event`. Each content type shares common fields and has dedicated fields for specific requirements. The feature provides functionalities such as creation, editing, querying, filtering, and draft management through a unified API and Firestore integration.

---

## Data Structure

### Unified Content Schema

#### Common Fields

| Field         | Type     | Description                                    |
| ------------- | -------- | ---------------------------------------------- |
| `id`          | `string` | Unique identifier for the content.             |
| `type`        | `string` | Type of content (`job`, `promotion`, `event`). |
| `title`       | `string` | Title of the content.                          |
| `description` | `string` | Detailed description.                          |
| `status`      | `string` | Status (`draft`, `published`, `archived`).     |
| `createdAt`   | `Date`   | Timestamp when the content was created.        |
| `updatedAt`   | `Date`   | Timestamp when the content was last updated.   |
| `userId`      | `string` | Identifier for the content creator.            |
| `views`       | `number` | Number of views the content has.               |
| `engagement`  | `number` | Engagement score.                              |
| `step`        | `number` | Current step in the content creation process.  |
| `coverImage`  | `string` | URL or path to the cover image.                |

#### Dedicated Fields by Type

- **Job**

  | Field                 | Type       | Description                    |
  | --------------------- | ---------- | ------------------------------ |
  | `jobType`             | `string`   | Type of job (e.g., full-time). |
  | `jobLocation`         | `string`   | Location of the job.           |
  | `salary`              | `string`   | Salary offered.                |
  | `requirements`        | `string[]` | List of job requirements.      |
  | `applicationDeadline` | `Date`     | Deadline for job applications. |

- **Promotion**

  | Field            | Type       | Description                              |
  | ---------------- | ---------- | ---------------------------------------- |
  | `promotionType`  | `string`   | Type of promotion (e.g., discount).      |
  | `location`       | `string`   | Location (`online`, `store`, `both`).    |
  | `validityPeriod` | `object`   | `{start: Date, end: Date}` for validity. |
  | `targetAudience` | `string[]` | Target audience groups.                  |

- **Event**

  | Field       | Type     | Description                       |
  | ----------- | -------- | --------------------------------- |
  | `eventType` | `string` | Type of event (e.g., conference). |
  | `eventDate` | `Date`   | Date of the event.                |
  | `venue`     | `string` | Event venue.                      |
  | `capacity`  | `number` | Maximum number of attendees.      |

---

## Steps Management

### Step Flow

1. **Type Selection**: The user selects the type of content to create before entering the steps.
2. **Step 1**: Fill in common fields (`title`, `description`, `type`).
3. **Step 2**: Fill in type-specific fields (e.g., `salary` for jobs).
4. **Step 3**: Upload or select a `coverImage` and view a definitive preview with an AI success prediction.

### Common Logic

- The `ContentFormManager` hook manages form state across all steps.
- The `ContentPreview` component dynamically updates the right-side preview as the user progresses through the steps.
- AI success prediction is triggered in Step 3 to analyze and provide feedback on the content.

---

## File-Level Details

### 1. `index.ts`

- **Scope**: Acts as the central export point for all content-related modules, ensuring cleaner imports across the project.
- **Methods**:
  - Export all hooks, services, and utilities used in the content feature.
- **Interactions**:
  - Enables other parts of the project to access content functionalities seamlessly.

### 2. `useContent.ts`

- **Scope**: Custom hook for managing the state and operations of content objects.
- **Methods**:
  - `fetchContent(id: string)`: Fetches content by its unique identifier.
  - `updateContent(data: Partial<Content>)`: Updates an existing content object.
  - `deleteContent(id: string)`: Deletes content by its unique identifier.
- **Inputs**:
  - Content ID or partial content object.
- **Outputs**:
  - Returns the requested content, operation results, or error messages.
- **Interactions**:
  - Works with `contentService.ts` for CRUD operations.

### 3. `useContentFormManager.ts`

- **Scope**: Handles the state of content creation and editing forms, including navigation across steps.
- **Methods**:
  - `handleNext()`: Moves to the next step in the form.
  - `handleBack()`: Returns to the previous step.
  - `saveDraft()`: Saves the current progress as a draft.
  - `resetForm()`: Clears all form data.
- **Inputs**:
  - Form data, user interactions.
- **Outputs**:
  - Updates form state or triggers content service operations.
- **Interactions**:
  - Integrates with `useContentStep.ts` for step-specific logic.

### 4. `useContentStep.ts`

- **Scope**: Manages step-specific logic for content creation.
- **Methods**:
  - `getCurrentStep()`: Retrieves the current step index.
  - `validateStep(data: Partial<Content>)`: Validates fields for the current step.
- **Inputs**:
  - Current step and content type.
- **Outputs**:
  - Validation results or step-related information.
- **Interactions**:
  - Relies on `contentValidation.ts` for validation logic.

### 5. `contentService.ts`

- **Scope**: Central service for performing CRUD operations on content.
- **Methods**:
  - `createContent(data: Partial<Content>)`: Creates new content.
  - `getContent(id: string)`: Retrieves content by its ID.
  - `updateContent(id: string, data: Partial<Content>)`: Updates existing content.
  - `deleteContent(id: string)`: Deletes content by its ID.
- **Inputs**:
  - Content data or ID.
- **Outputs**:
  - Operation results or error messages.
- **Interactions**:
  - Communicates with Firestore to manage data.

### 6. `contentValidation.ts`

- **Scope**: Provides validation rules for content fields and steps.
- **Methods**:
  - `validateContent(data: Partial<Content>)`: Validates required fields for publishing.
  - `validateTypeSpecific(data: Partial<Content>)`: Checks type-specific fields (e.g., `jobType` for jobs).
- **Inputs**:
  - Content data or specific fields.
- **Outputs**:
  - List of validation errors (if any).
- **Interactions**:
  - Used by `contentService.ts` and `useContentStep.ts`.

### 7. `ContentPreview.tsx`

- **Scope**: Dynamically displays a preview of the content on the right side of the page during content creation.
- **Methods**:
  - None (stateless component).
- **Inputs**:
  - `content`: Content object containing common and type-specific fields.
  - `step`: Current step of the form.
- **Outputs**:
  - Rendered JSX for the preview.
- **Interactions**:
  - Updates dynamically as `content` data changes.
  - Integrates with AI success prediction in Step 3 to display feedback.



### File-Level Implementation for Services

#### 1. `contentService.ts`

- **Scope**: Centralized service for performing CRUD operations on content objects.
- **Implementation Details**:
  - **Methods**:
    - `createContent(data: Partial<Content>): Promise<string>`
      - Validates `data` for required and type-specific fields.
      - Saves `data` to Firestore under the `content` collection.
      - Returns the document ID.
    - `getContent(id: string): Promise<Content | null>`
      - Fetches a document from Firestore by `id`.
      - Returns the content object or `null` if not found.
    - `updateContent(id: string, data: Partial<Content>): Promise<void>`
      - Updates specific fields of an existing content object by `id`.
      - Logs errors if the update fails.
    - `deleteContent(id: string): Promise<void>`
      - Deletes a content object by its `id`.
  - **Interactions**:
    - Interacts with Firestore for all data storage and retrieval operations.
    - Validates inputs using `contentValidation.ts`.

#### 2. `contentValidation.ts`

- **Scope**: Provides validation rules for all content-related fields and creation steps.
- **Implementation Details**:
  - **Methods**:
    - `validateContent(data: Partial<Content>): string[]`
      - Validates common fields (e.g., `title`, `description`).
      - Returns a list of validation error messages.
    - `validateTypeSpecific(data: Partial<Content>): string[]`
      - Ensures required fields for `job`, `promotion`, or `event` are present.
      - Validates type-specific constraints (e.g., `applicationDeadline` > `currentDate` for jobs).
  - **Interactions**:
    - Called by `contentService.ts` before performing Firestore operations.
    - Used by `useContentStep.ts` for validating fields at each step.

#### 3. `useContent.ts`

- **Scope**: Custom React hook for managing content state and handling operations.
- **Implementation Details**:
  - **Methods**:
    - `fetchContent(id: string): Promise<Content>`
      - Calls `contentService.getContent` to fetch the content by ID.
      - Updates local state with the fetched data.
    - `updateContent(data: Partial<Content>): Promise<void>`
      - Calls `contentService.updateContent` to persist changes.
      - Optimistically updates local state.
    - `deleteContent(id: string): Promise<void>`
      - Calls `contentService.deleteContent` to remove content from Firestore.
  - **Interactions**:
    - Works with `contentService.ts` for Firestore calls.
    - Updates state for real-time content updates.

#### 4. `useContentFormManager.ts`

- **Scope**: Manages the state of forms during content creation or editing.
- **Implementation Details**:
  - **Methods**:
    - `handleNext()`: Advances to the next step in the form.
    - `handleBack()`: Returns to the previous step.
    - `saveDraft()`: Calls `contentService.updateContent` with `status: 'draft'`.
    - `resetForm()`: Clears all form data.
  - **Interactions**:
    - Calls `useContentStep.ts` for validation logic.
    - Updates the `ContentPreview` component dynamically.

#### 5. `useContentStep.ts`

- **Scope**: Provides utilities for managing and validating each step of the content creation process.
- **Implementation Details**:
  - **Methods**:
    - `getCurrentStep(): number`
      - Returns the current step index.
    - `validateStep(data: Partial<Content>): string[]`
      - Validates fields required for the current step.
      - Calls `contentValidation.validateContent` and `contentValidation.validateTypeSpecific`.
  - **Interactions**:
    - Used by `useContentFormManager.ts` for step-by-step validation.

---

### Interactions Between Services

- **Validation**:
  - `contentService.ts` relies on `contentValidation.ts` to ensure data integrity before database operations.
- **State Management**:
  - `useContent.ts` and `useContentFormManager.ts` handle local state updates while coordinating with `contentService.ts` for database interactions.
- **Step Logic**:
  - `useContentStep.ts` integrates with `useContentFormManager.ts` to ensure valid transitions between steps.

### Firestore-Specific Implementation

- **Firestore Rules**:
  - Ensure that only authorized users can perform CRUD operations on the `content` collection.
  - Validate required fields server-side for security.
  - Example Rule:
    ```
    match /content/{contentId} {
      allow read, write: if request.auth.uid != null;
      allow create: if validateContent(request.resource.data);
    }

    function validateContent(data) {
      return data.title != null && data.type in ['job', 'promotion', 'event'];
    }
    ```

### File-Level Implementation for Hooks

#### 1. `useContent.ts`

- **Scope**: Custom React hook for managing content state and performing CRUD operations.
- **Implementation Details**:
  - **Methods**:
    - `fetchContent(id: string): Promise<Content>`
      - Fetches content by ID using `contentService.getContent`.
      - Updates local state with the fetched data.
    - `updateContent(data: Partial<Content>): Promise<void>`
      - Calls `contentService.updateContent` to save updates.
      - Optimistically updates local state.
    - `deleteContent(id: string): Promise<void>`
      - Deletes content using `contentService.deleteContent` and updates local state.
  - **Inputs**:
    - Content ID or partial content object.
  - **Outputs**:
    - Updated state or error messages.
  - **Interactions**:
    - Works with `contentService.ts` to handle Firestore operations.

#### 2. `useContentFormManager.ts`

- **Scope**: Manages state and actions for multi-step content creation and editing forms.
- **Implementation Details**:
  - **Methods**:
    - `handleNext()`: Advances to the next step of the form.
    - `handleBack()`: Moves to the previous step.
    - `saveDraft()`: Saves progress by calling `contentService.updateContent` with `status: 'draft'`.
    - `resetForm()`: Resets form state and clears data.
  - **Inputs**:
    - Current step data and user inputs.
  - **Outputs**:
    - Updated form state or draft content ID.
  - **Interactions**:
    - Integrates with `useContentStep.ts` for step-specific validation.

#### 3. `useContentStep.ts`

- **Scope**: Provides utilities for handling and validating step-specific logic in the content creation process.
- **Implementation Details**:
  - **Methods**:
    - `getCurrentStep(): number`
      - Returns the index of the current step.
    - `validateStep(data: Partial<Content>): string[]`
      - Validates required fields for the current step.
      - Calls `contentValidation.validateContent` and `validateTypeSpecific` methods.
  - **Inputs**:
    - Current step index and content type.
  - **Outputs**:
    - Validation results or step navigation status.
  - **Interactions**:
    - Works with `contentValidation.ts` for field-level validation.
    - Utilized by `useContentFormManager.ts` to enforce validation before transitions.

---

### Interactions Between Hooks

1. **State Management**:

   - `useContent.ts` maintains global content state.
   - `useContentFormManager.ts` manages form-level state for multi-step workflows.

2. **Validation**:

   - `useContentStep.ts` validates fields dynamically based on the step and content type.
   - Calls `contentValidation.ts` for consistency.

3. **CRUD Operations**:

   - Hooks rely on `contentService.ts` to perform Firestore operations.
   - `useContent.ts` ensures Firestore updates are reflected in the local state.

---

### File-Level Implementation for Components

#### 1. `ContentPreview.tsx`

- **Scope**: Dynamically displays a live preview of the content during creation or editing.
- **Implementation Details**:
  - **Methods**: None (stateless component).
  - **Inputs**:
    - `content`: Object containing all fields (common and type-specific).
    - `step`: Current step in the content creation flow.
  - **Outputs**:
    - Renders JSX dynamically based on `content` and `step`.
  - **Interactions**:
    - Updates dynamically as the `content` changes.
    - Handles `coverImage` display and type-specific preview fields.

#### 2. `NewContentForm.tsx`

- **Scope**: The main form component for creating new content.
- **Implementation Details**:
  - **Methods**:
    - `onCancel()`: Cancels the creation process.
    - `onSaveDraft()`: Saves progress as a draft.
    - `onPublish()`: Finalizes and publishes the content.
  - **Inputs**:
    - Current step and form data.
  - **Outputs**:
    - Triggers form navigation or service calls.
  - **Interactions**:
    - Renders step components (`ContentStep1`, `ContentStep2`, etc.).
    - Updates `ContentPreview.tsx` dynamically.

#### 3. `ContentStep1.tsx`

- **Scope**: Handles common fields for all content types.
- **Implementation Details**:
  - **Methods**: None (stateless component).
  - **Inputs**:
    - Form data for common fields (`title`, `description`, `type`).
  - **Outputs**:
    - Validated data passed to `NewContentForm.tsx`.
  - **Interactions**:
    - Updates `ContentPreview.tsx` as fields are filled.

#### 4. `ContentStep2.tsx`

- **Scope**: Manages type-specific fields based on the selected content type.
- **Implementation Details**:
  - **Methods**: None (stateless component).
  - **Inputs**:
    - Type-specific form data.
  - **Outputs**:
    - Updates the form state for the selected type.
  - **Interactions**:
    - Integrates with `ContentPreview.tsx` to display type-specific previews dynamically.

#### 5. `ContentStep3.tsx`

- **Scope**: Uploads or selects a `coverImage` and finalizes the preview with AI success prediction.
- **Implementation Details**:
  - **Methods**:
    - `onUpload(image: File)`: Handles uploading the `coverImage`.
    - `triggerAISuccessPrediction(content: Content)`: Calls an AI service to predict success.
  - **Inputs**:
    - Finalized content data, including `coverImage`.
  - **Outputs**:
    - Updated preview with AI feedback.
  - **Interactions**:
    - Updates `ContentPreview.tsx` with the final preview.

#### 6. Type-Specific Components (`JobPreview.tsx`, `PromotionPreview.tsx`, `EventPreview.tsx`)

- **Scope**: Render previews for each content type.
- **Implementation Details**:
  - **Methods**: None (stateless components).
  - **Inputs**:
    - Content data specific to the type.
  - **Outputs**:
    - JSX for the specific type (e.g., `jobType`, `promotionType`, etc.).
  - **Interactions**:
    - Called within `ContentPreview.tsx`.

#### 7. `ContentDetail.tsx`

- **Scope**: Displays detailed information about a specific content item.
- **Implementation Details**:
  - **Methods**: None (stateless component).
  - **Inputs**:
    - Full content data fetched via `contentService.getContent`.
  - **Outputs**:
    - Renders a detailed view of the content, including common and type-specific fields.
  - **Interactions**:
    - Fetches content details using `useContent.ts`.
    - Supports navigation to edit or delete the content.

---

### Interactions Between Components

1. **Preview Updates**:

   - `ContentPreview.tsx` dynamically updates as data flows from `NewContentForm.tsx` and its step components.

2. **Step Transitions**:

   - `ContentStep1`, `ContentStep2`, and `ContentStep3` pass validated data back to `NewContentForm.tsx` for form progression.

3. **Type-Specific Logic**:

   - Type-specific components ensure dynamic rendering of fields in both preview and detail views.

4. **AI Integration**:

   - `ContentStep3.tsx` integrates AI feedback directly into the preview for user insights.



## Methods and Expected Behavior

### 1. **Content Creation**

- **Method**: `createContent(data: Partial<Content>): Promise<string>`
- **Inputs**:
  - `data`: Partial content object including common and type-specific fields.
- **Outputs**:
  - `Promise<string>`: ID of the newly created content.
- **Steps**:
  1. Validate required fields.
  2. Validate type-specific fields.
  3. Save the content to Firestore with `draft` status.

### 2. **Fetching Content**

- **Method**: `getContent(id: string): Promise<Content | null>`
- **Inputs**:
  - `id`: Content identifier.
- **Outputs**:
  - `Promise<Content | null>`: The fetched content object or `null` if not found.

### 3. **Updating Content**

- **Method**: `updateContent(id: string, data: Partial<Content>): Promise<void>`
- **Inputs**:
  - `id`: Content identifier.
  - `data`: Partial content object with updated fields.
- **Outputs**:
  - `Promise<void>`: Resolves when update is successful.

### 4. **Draft Management**

- **Method**: `saveDraft(id: string, data: Partial<Content>): Promise<void>`
- **Behavior**:
  - Updates the content with `status: 'draft'`.

### 5. **Publishing Content**

- **Method**: `publishContent(id: string): Promise<void>`
- **Behavior**:
  - Updates the content with `status: 'published'` and sets `publishDate`.
- **Validation Rules for Publishing**:
  - Common Fields: `title`, `description`, `type`, `userId`, `coverImage`.
  - Type-Specific Fields:
    - **Job**: `jobType`, `jobLocation`, `applicationDeadline`.
    - **Promotion**: `promotionType`, `location`, `validityPeriod.start`, `validityPeriod.end`.
    - **Event**: `eventType`, `eventDate`, `venue`.

---

## API Calls

### Firestore Collection Structure

- **Collection**: `content`
- **Example Document**:

```json
{
  "id": "1",
  "type": "promotion",
  "title": "Summer Sale",
  "description": "Up to 50% off",
  "status": "published",
  "userId": "user123",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-02T00:00:00Z",
  "step": 3,
  "coverImage": "https://example.com/image.jpg",
  "promotionType": "discount",
  "location": "online",
  "validityPeriod": { "start": "2024-01-01", "end": "2024-01-10" }
}
```

---

## State Management

### Overview

Local state in the project is managed primarily through React hooks and Context API. The `useContentFormManager` hook handles state specific to the multi-step form, while global content state (e.g., drafts, published content) is managed using a combination of `useContent` and Firestore-backed services.

### Tools and Libraries

- **React Context API**:
  - Used to provide shared state and actions across components.
  - Handles form progression, validation state, and draft management.
- **Firestore Integration**:
  - Acts as a persistence layer for content drafts and published items.
  - Real-time updates are synced to local state.

### Key Interactions

#### 1. `useContentFormManager`

- **Role**: Tracks the state of fields, steps, and validation errors during content creation.
- **Interactions**:
  - Calls `useContentStep` for step-specific validations.
  - Updates the `ContentPreview` dynamically as users modify inputs.
  - Invokes `contentService.updateContent` to save progress as drafts.

#### 2. `useContent`

- **Role**: Manages global content state, including fetching and updating content.
- **Interactions**:
  - Fetches initial data for editing existing content.
  - Syncs updates to Firestore and reflects changes in the UI.

#### 3. `useContentStep`

- **Role**: Validates fields dynamically based on the current step.
- **Interactions**:
  - Ensures that all required fields are filled before transitioning to the next step.
  - Provides step validation feedback to `useContentFormManager`.

### Flow Example

1. **Initial Load**:

   - `useContent` fetches content data from Firestore and initializes local state.
   - `useContentFormManager` sets up field tracking and validation for the form.

2. **Step Transitions**:

   - When `handleNext` is invoked, `useContentStep` validates the current step.
   - On success, the state progresses to the next step, and `ContentPreview` updates dynamically.

3. **Draft Management**:

   - Changes are saved as drafts via `useContentFormManager.saveDraft`, which syncs data with Firestore using `contentService`.

4. **Publishing**:

   - Final content is validated and published via `contentService.createContent`.

### Benefits

- Centralized state management using React hooks ensures simplicity and predictability.
- Context API allows seamless sharing of state between components without prop drilling.
- Firestore integration guarantees persistence and real-time updates.



## Preview Management

- **Visible Fields in Preview**:

  - **Job**: `title`, `description`, `jobType`, `jobLocation`, `salary`, `coverImage`.
  - **Promotion**: `title`, `description`, `promotionType`, `location`, `validityPeriod`, `coverImage`.
  - **Event**: `title`, `description`, `eventType`, `eventDate`, `venue`, `coverImage`.

- **Example**:

```typescript
function ContentPreview({ content }: { content: Content }) {
  switch (content.type) {
    case 'job':
      return <JobPreview content={content} />;
    case 'promotion':
      return <PromotionPreview content={content} />;
    case 'event':
      return <EventPreview content={content} />;
    default:
      return <div>Unsupported content type</div>;
  }
}
```



Cover Image Management



Inserting a Cover Image



URL Input:



The user can provide a URL pointing to the image.



Validate the URL to ensure it points to a valid image resource (e.g., check for supported extensions like .jpg, .png).



function handleCoverImageInput(url: string): void {

&#x20; if (isValidImageUrl(url)) {

&#x20;   setCoverImage(url);

&#x20; } else {

&#x20;   alert('Invalid image URL');

&#x20; }

}



function isValidImageUrl(url: string): boolean {

&#x20; return /\\.(jpeg|jpg|png|gif)\$/.test(url);

}



Preview Image:



Dynamically update the ContentPreview component to display the image.



\<img src={coverImage} alt="Cover Preview" className="cover-preview" />



Previewing the Cover Image



Dynamic Preview:



As the user inputs the URL, the ContentPreview component updates immediately to show the image.



function ContentPreview({ content }: { content: Content }) {

&#x20; return (

&#x20;   \<div className="content-preview">

&#x20;     {content.coverImage && (

&#x20;       \<img src={content.coverImage} alt="Cover" className="cover-preview" />

&#x20;     )}

&#x20;     {/\* Additional preview fields here \*/}

&#x20;   \</div>

&#x20; );

}



Fallback Mechanism:



Display a placeholder image or message if no URL is provided:

Error Handling



General Principles



Validation Errors:



All validation errors (e.g., missing fields, invalid input formats) are surfaced to the user with clear and actionable messages.



These errors are displayed inline next to the affected fields or as a list at the top of the form.



Network Errors:



Errors during API calls (e.g., network timeouts, server errors) are handled gracefully.



A global error banner or toast notification is used to inform users of the issue, with retry options where applicable.



Logging:



All errors are logged to the console during development for debugging.



Optional integration with a logging service (e.g., Sentry) for production environments to track and resolve user-facing issues.



Component-Level Error Handling



1\. NewContentForm.tsx



Error Types:



Validation errors for common and type-specific fields.



Errors during draft save or publish operations.



Implementation:



function handleSubmit() {

&#x20; const errors = validateContent(formData);

&#x20; if (errors.length > 0) {

&#x20;   setErrorMessages(errors);

&#x20;   return;

&#x20; }



&#x20; try {

&#x20;   if (isDraft) {

&#x20;     saveDraft(formData);

&#x20;   } else {

&#x20;     publishContent(formData);

&#x20;   }

&#x20; } catch (error) {

&#x20;   setGlobalError('An unexpected error occurred. Please try again.');

&#x20; }

}



User Feedback:



Inline validation messages next to fields.



A global error banner for unexpected issues.



2\. ContentPreview\.tsx



Error Types:



Missing required fields for rendering (e.g., coverImage).



Invalid data formats (e.g., invalid image URLs).



Implementation:



function ContentPreview({ content }: { content: Content }) {

&#x20; if (!content.title) {

&#x20;   return \<div className="error">Title is required for preview.\</div>;

&#x20; }



&#x20; if (content.coverImage && !isValidImageUrl(content.coverImage)) {

&#x20;   return \<div className="error">Invalid cover image URL.\</div>;

&#x20; }



&#x20; return (

&#x20;   \<div>

&#x20;     \<img src={content.coverImage} alt="Cover" />

&#x20;     \<h1>{content.title}\</h1>

&#x20;   \</div>

&#x20; );

}



3\. ContentStep3.tsx



Error Types:



Upload failures for coverImage.



AI success prediction errors.



Implementation:



async function handleImageUpload(file: File) {

&#x20; try {

&#x20;   const imageUrl = await uploadImage(file);

&#x20;   setCoverImage(imageUrl);

&#x20; } catch (error) {

&#x20;   setError('Failed to upload image. Please try again.');

&#x20; }

}



async function triggerAISuccessPrediction(content: Content) {

&#x20; try {

&#x20;   const result = await getAISuccessPrediction(content);

&#x20;   setPredictionResult(result);

&#x20; } catch (error) {

&#x20;   setGlobalError('AI prediction failed. Please try again later.');

&#x20; }

}



User Feedback:



Inline error messages for failed uploads.



Fallback to manual checks if AI prediction fails.



Hook-Level Error Handling



1\. useContentFormManager.ts



Error Types:



Validation errors during step transitions.



Errors during draft save or publish calls.



Implementation:



function handleNext() {

&#x20; const errors = validateStep(currentStepData);

&#x20; if (errors.length > 0) {

&#x20;   setStepErrors(errors);

&#x20;   return;

&#x20; }



&#x20; try {

&#x20;   goToNextStep();

&#x20; } catch (error) {

&#x20;   setGlobalError('Step transition failed.');

&#x20; }

}



User Feedback:



Step-specific error messages displayed inline.



Global error handling for unexpected failures.



2\. useContent.ts



Error Types:



Errors during CRUD operations (e.g., fetch, update, delete).



Implementation:



async function fetchContent(id: string) {

&#x20; try {

&#x20;   const content = await contentService.getContent(id);

&#x20;   setContent(content);

&#x20; } catch (error) {

&#x20;   setGlobalError('Failed to fetch content. Please refresh the page.');

&#x20; }

}



User Feedback:



A global error message or toast for fetch failures.



Retry options if the operation is recoverable.



Testing Strategy



Tools and Frameworks



Unit Testing:



Framework: Jest



Provides a comprehensive environment for unit tests.



Supports mocking of modules and services.



Utility: React Testing Library



Focuses on testing components through their public interface.



Ensures DOM interactions match user behavior.



Integration Testing:



Combine multiple components, hooks, or services to test their interactions.



Use Jest with custom setups to mock API responses and simulate full workflows.



End-to-End (E2E) Testing:



Framework: Cypress



Tests the entire user flow, including UI interactions and API calls.



Ensures correctness of content creation, editing, and publishing.



Unit Testing



Hooks



useContent.ts:



Tests:



Verify fetchContent fetches data and updates state.



Validate proper handling of errors during CRUD operations.



Example:



describe('useContent Hook', () => {

&#x20; it('fetches and sets content successfully', async () => {

&#x20;   const mockContent = { id: '1', title: 'Test' };

&#x20;   contentService.getContent = jest.fn().mockResolvedValue(mockContent);



&#x20;   const { result, waitForNextUpdate } = renderHook(() => useContent());



&#x20;   await act(async () => {

&#x20;     await result.current.fetchContent('1');

&#x20;   });



&#x20;   expect(result.current.content).toEqual(mockContent);

&#x20; });



&#x20; it('handles fetch errors', async () => {

&#x20;   contentService.getContent = jest.fn().mockRejectedValue(new Error('Failed to fetch'));



&#x20;   const { result } = renderHook(() => useContent());



&#x20;   await act(async () => {

&#x20;     await result.current.fetchContent('1');

&#x20;   });



&#x20;   expect(result.current.error).toBe('Failed to fetch');

&#x20; });

});



useContentFormManager.ts:



Tests:



Validate step transitions and state updates.



Ensure saveDraft calls the correct service method.



Example:



it('saves draft content', async () => {

&#x20; const mockSaveDraft = jest.fn();

&#x20; contentService.updateContent = mockSaveDraft;



&#x20; const { result } = renderHook(() => useContentFormManager());

&#x20; act(() => {

&#x20;   result.current.saveDraft({ title: 'Draft Title' });

&#x20; });



&#x20; expect(mockSaveDraft).toHaveBeenCalledWith(expect.objectContaining({ title: 'Draft Title' }));

});



Services



contentService.ts:



Tests:



Verify CRUD operations interact with Firestore correctly.



Ensure validation logic is invoked where required.



Example:



describe('contentService', () => {

&#x20; it('creates content successfully', async () => {

&#x20;   const mockAddDoc = jest.fn().mockResolvedValue({ id: '1' });

&#x20;   firestore.addDoc = mockAddDoc;



&#x20;   const result = await contentService.createContent({ title: 'New Content' });



&#x20;   expect(mockAddDoc).toHaveBeenCalled();

&#x20;   expect(result).toBe('1');

&#x20; });



&#x20; it('throws an error when content creation fails', async () => {

&#x20;   firestore.addDoc = jest.fn().mockRejectedValue(new Error('Firestore Error'));



&#x20;   await expect(contentService.createContent({ title: 'New Content' })).rejects.toThrow('Firestore Error');

&#x20; });

});



Integration Testing



Content Creation Flow:



Simulate user interactions across steps (ContentStep1, ContentStep2, ContentStep3).



Mock API calls for saving drafts and publishing content.



Verify the ContentPreview updates dynamically.



Example:



it('completes content creation successfully', async () => {

&#x20; render(\<NewContentForm />);



&#x20; fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Test Title' } });

&#x20; fireEvent.click(screen.getByText('Next'));



&#x20; fireEvent.change(screen.getByLabelText('Job Type'), { target: { value: 'Full-Time' } });

&#x20; fireEvent.click(screen.getByText('Next'));



&#x20; fireEvent.change(screen.getByLabelText('Cover Image'), { target: { value: '[https://example.com/image.jpg](https://example.com/image.jpg)' } });

&#x20; fireEvent.click(screen.getByText('Publish'));



&#x20; await waitFor(() => expect(mockPublishContent).toHaveBeenCalled());

});



End-to-End (E2E) Testing



Flow Tests:



Verify that a user can create, edit, and publish content.



Mock server responses using Cypress intercepts.



Error Scenarios:



Test handling of network errors and form validation issues.



Example:



describe('Content Creation E2E', () => {

&#x20; it('creates content successfully', () => {

&#x20;   cy.visit('/new-content');



&#x20;   cy.get('input[name="title"]').type('Test Title');

&#x20;   cy.contains('Next').click();



&#x20;   cy.get('select[name="jobType"]').select('Full-Time');

&#x20;   cy.contains('Next').click();



&#x20;   cy.get('input[name="coverImage"]').type('[https://example.com/image.jpg](https://example.com/image.jpg)');

&#x20;   cy.contains('Publish').click();



&#x20;   cy.contains('Content Published Successfully');

&#x20; });

});


### Updates to Content Management

#### 1. Centralized Validation
- Validation logic has been centralized using the `validateFormData` utility.
- Required fields are dynamically validated based on the content type (`job`, `promotion`, `event`) and context (`draft` or `publish`).

#### 2. Validation Rules
- Draft Validation (`draft`):
  - `title` and `description` are the minimal required fields for saving a draft.
- Publish Validation (`publish`):
  - All required fields for the respective content type must be completed:
    - **Job**: `title`, `description`, `jobType`, `jobLocation`, `salary`
    - **Promotion**: `title`, `description`, `promotionType`, `targetAudience`, `validityPeriod`
    - **Event**: `title`, `description`, `eventDate`, `venue`, `capacity`

#### 3. Multi-Step Form Enhancements
- Components now dynamically validate their respective step fields before transitioning to the next step.
- Improved error handling provides clear feedback to users about missing fields.

#### 4. Updated Components and Workflow
- **Step Components (`JobSteps`, `PromotionSteps`, `EventSteps`)**:
  - Validate required fields using `validateFormData`.
  - Manage local form state and propagate data changes back to the parent form manager.
- **Form Manager Hook (`useContentFormManager`)**:
  - Handles navigation (`handleNext`, `handleBack`), draft saving, and publishing.
  - Refactored to streamline validation and improve state management.

#### 5. Testing Requirements
- Add unit tests for:
  - Validation logic (`draft` vs. `publish`).
  - Step transitions with incomplete data.
- Example Test Case:
```javascript
test('Validates draft data correctly', () => {
  const data = { title: 'Job Title', description: '' };
  expect(validateFormData(data, 'job', 'draft')).toBe(false);
});
```









##

```typescript


```
