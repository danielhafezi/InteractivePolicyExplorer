# Product Requirements Document (PRD)
# Interactive Policy Explorer: A Gemini-Powered Economic Policy Simulation

## 1. Project Overview

### 1.1 Product Vision
The Interactive Policy Explorer (IPE) is a personal project built with NextJS that demonstrates the capabilities of LLMs in economic policy simulation. It allows users to explore how various economic and technological transition policies might impact different socio-economic groups through an intuitive visual interface powered by Google's Gemini Flash 2 model.

### 1.2 Target Audience
- Academic portfolio showcase
- Personal demonstration of LLM capabilities
- Potential PhD application supplement focusing on "LLM-ABMs to explore how Socio-Economic Factors and Work Identity shape political preferences"

### 1.3 Key Value Proposition
This project showcases how LLMs can be leveraged to simulate diverse human reactions to economic policies across socio-economic groups. By providing an interactive visualization of these simulated reactions, it demonstrates the potential of LLMs for agent-based modeling in economic contexts.

## 2. Functional Requirements

### 2.1 Policy Input Interface

#### 2.1.1 Policy Category Selection
- Users can select from predefined policy categories:
  - **Green Transition Policies**: Carbon taxes, renewable subsidies, green job initiatives
  - **AI/Automation Policies**: UBI, worker retraining programs, automation taxes
  - **Combined Approaches**: Policy packages addressing both transitions

#### 2.1.2 Policy Parameter Configuration
- Simple sliders for adjusting key policy parameters:
  - Implementation timeline (immediate vs. phased)
  - Funding approach (who pays for it)
  - Intensity levels (aggressive vs. moderate)

#### 2.1.3 Custom Policy Description
- Free-text field allowing users to describe custom policies
- Character-limited to ensure manageable prompt size for Gemini

### 2.2 Socio-Economic Group Definition

#### 2.2.1 Predefined Agent Profiles
- Implement distinct system prompts for Gemini representing different population segments:
  - **Economic Class**:
    - Low-income workers (service industry, gig economy)
    - Middle-class professionals
    - High-income business owners/executives
  - **Work Identity**:
    - Manufacturing/industrial workers
    - Tech sector employees
    - Traditional energy sector workers
    - Green energy sector workers
  - **Age Demographics**:
    - Young workers (18-30)
    - Mid-career professionals (30-50)
    - Older workers (50+)
  - **Geographic Context**:
    - Urban centers
    - Suburban communities
    - Rural areas

#### 2.2.2 System Prompt Engineering
- Each socio-economic group defined by a carefully crafted system prompt for Gemini:
  ```
  You are simulating a [demographic description] responding to an economic policy.
  Your background includes [economic situation, job history, skills].
  Your political views tend toward [relevant spectrum position].
  Your primary economic concerns are [specific concerns].
  ```

### 2.3 Gemini-Powered Simulation

#### 2.3.1 Gemini Flash 2 Integration
- Integration with Google AI's Gemini 2.0 Flash API
- Efficient prompt management to minimize token usage
- Caching of responses for reused scenarios

#### 2.3.2 Agent Response Generation
- Query Gemini to simulate responses for each socio-economic group:
  - Economic impact assessment (personal and community)
  - Political reaction (support/opposition and reasoning)
  - Behavioral changes (job seeking, relocation, retraining)
  - Short narrative explaining the rationale

#### 2.3.3 Structured Output Format
- Standardized JSON output format for consistent visualization:
  ```json
  {
    "economic_impact": {
      "personal_impact_score": [-5 to 5],
      "community_impact_score": [-5 to 5],
      "rationale": "string"
    },
    "political_reaction": {
      "support_level": [-5 to 5],
      "key_concerns": ["string"],
      "values_alignment": [-5 to 5]
    },
    "behavioral_response": {
      "likely_actions": ["string"],
      "adaptation_strategies": ["string"]
    },
    "narrative": "string"
  }
  ```

### 2.4 Visualization Dashboard

#### 2.4.1 Overview Metrics
- Heat map showing policy support/opposition across all groups
- Diverging bar charts comparing impact scores
- Summary statistics of overall sentiment

#### 2.4.2 Group-Specific Visualizations
- Detailed cards for each socio-economic group showing:
  - Support/opposition gauge
  - Key concerns word cloud
  - Expected behavioral changes
  - Representative narrative

#### 2.4.3 Comparative Analysis
- Side-by-side comparison of reactions across different groups
- Highlight areas of consensus and disagreement
- Visualization of polarization and division

### 2.5 User Experience Features

#### 2.5.1 Interactive Elements
- Hover-over tooltips explaining each visualization
- Click-through for detailed group responses
- Ability to adjust parameters and re-run simulation

#### 2.5.2 Narrative Integration
- Generated summaries of key findings
- Highlighted quotes from different perspectives
- Visual storytelling elements explaining reaction patterns

## 3. Technical Requirements

### 3.1 NextJS Implementation

#### 3.1.1 Project Structure
- NextJS 14+ application with App Router
- TypeScript for type safety
- Component-based architecture for visualization elements

#### 3.1.2 Frontend Framework
- React with functional components and hooks
- Tailwind CSS for styling
- Responsive design for different screen sizes

#### 3.1.3 State Management
- React Context for application state
- Local storage for saving recent simulations
- Client-side data processing

### 3.2 Gemini API Integration

#### 3.2.1 API Client
- Serverless function for Gemini API calls
- Error handling and retry logic
- Response validation and parsing

#### 3.2.2 Prompt Engineering
- Template system for generating system prompts
- Context management to optimize token usage
- Instruction fine-tuning for consistent outputs

#### 3.2.3 Response Processing
- JSON parsing with fallback handling
- Normalization of response values
- Aggregation for summary statistics

### 3.3 Visualization Components

#### 3.3.1 Charting Libraries
- D3.js for custom visualizations
- React-specific charting libraries for standard charts
- CSS animations for interactive elements

#### 3.3.2 Data Visualization Types
- Heat maps for cross-group comparisons
- Radar charts for multidimensional impact assessment
- Sankey diagrams for policy impact flows
- Bar/column charts for quantitative comparisons

#### 3.3.3 UI Components
- Responsive grid layouts
- Card-based design for group profiles
- Toggle controls for filtering views

### 3.4 Data Flow

#### 3.4.1 Client-Side Processing
- All simulation data processed in-browser
- No database requirements
- Cache API responses in localStorage

#### 3.4.2 Data Structures
- Normalized state shape for efficient rendering
- Hierarchical organization of response data
- Optimized for visualization rendering

## 4. Development Considerations

### 4.1 Development Environment

#### 4.1.1 Local Setup
- NodeJS development environment
- NextJS development server
- Environment variables for API keys

#### 4.1.2 Version Control
- Git repository
- Branch-based workflow
- Conventional commits

### 4.2 Performance Optimization

#### 4.2.1 API Usage
- Batched API requests to minimize calls
- Response caching for duplicate scenarios
- Debounced user input to avoid excessive calls

#### 4.2.2 Rendering Efficiency
- React memo for expensive components
- Virtualization for long lists
- Lazy loading for visualization components

### 4.3 Project Scope Boundaries

#### 4.3.1 In Scope
- NextJS single-page application
- Gemini Flash 2 integration
- Interactive policy simulation
- Visual representation of group responses
- Client-side data processing

#### 4.3.2 Out of Scope
- User accounts/authentication
- Data persistence beyond browser session
- Multiple LLM comparisons
- Server-side processing
- Export functionality
- Deployment infrastructure

## 5. User Experience Flow

### 5.1 Policy Definition
1. User selects policy category from predefined options
2. User adjusts key parameters via sliders/inputs
3. User optionally enters custom policy description
4. User clicks "Simulate Policy Impact" button

### 5.2 Simulation Processing
1. System generates appropriate prompts for each socio-economic group
2. API calls to Gemini are made (with loading indicators)
3. Responses are processed and normalized
4. Visualization data is prepared

### 5.3 Results Exploration
1. Overview dashboard displays with summary metrics
2. User can filter/sort by different demographic dimensions
3. User can click on specific groups to see detailed responses
4. User can adjust policy and re-run simulation for comparison

## 6. Project Goals and Success Metrics

### 6.1 Primary Goals
- Demonstrate LLM capabilities for simulating diverse economic perspectives
- Create compelling, interactive visualizations of policy impacts
- Showcase NextJS and React implementation skills
- Provide a proof-of-concept for PhD application focus

### 6.2 Secondary Goals
- Explore the potential and limitations of LLMs for agent-based economic modeling
- Create a visually appealing portfolio piece
- Experiment with novel visualization techniques for LLM outputs