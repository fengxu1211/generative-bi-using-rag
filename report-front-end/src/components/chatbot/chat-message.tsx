import {
  BarChart,
  ColumnLayout,
  Container,
  ExpandableSection,
  LineChart,
  PieChart,
  SpaceBetween,
  Table,
  TextContent
} from "@cloudscape-design/components";
import { ChatBotHistoryItem } from "./types";
import Button from "@cloudscape-design/components/button";
import SyntaxHighlighter from "react-syntax-highlighter";
import styles from "../../styles/chat.module.scss";
import SuggestedQuestions from "./suggested-questions";

export interface ChatMessageProps {
  message: ChatBotHistoryItem;
  onThumbsUp: () => void;
  onThumbsDown: () => void;
}

export interface ChartTypeProps {
  data_show_type: string;
  sql_data: any[][];
}

function ChartPanel(props: ChartTypeProps) {
  const sql_data = props.sql_data;
  switch (props.data_show_type) {
    case 'bar':
      // convert data to bar chart data
      const header = sql_data[0];
      const items = sql_data.slice(1, sql_data.length);
      const key = ['x', 'y'];
      const content = items.map((item) => {
        const map: any = new Map(item.map((value, index) => {
          return [key[index], value];
        }));
        return Object.fromEntries(map);
      });
      const seriesValue: any = [{
        title: header[1],
        type: "bar",
        data: content
      }];
      return (
        <BarChart
          series={seriesValue}
          height={300}
          hideFilter
          xTitle={header[0]}
          yTitle={header[1]}
        />
      );
    case 'line':
      // convert data to line chart data
      const lineHeader = sql_data[0];
      const lineItems = sql_data.slice(1, sql_data.length);
      const lineKey = ['x', 'y'];
      const lineContent = lineItems.map((item) => {
        const map: any = new Map(item.map((value, index) => {
          return [lineKey[index], value];
        }));
        return Object.fromEntries(map);
      });
      const lineSeriesValue: any = [{
        title: lineHeader[1],
        type: "line",
        data: lineContent
      }];
      return (
        <LineChart
          series={lineSeriesValue}
          height={300}
          hideFilter
          xScaleType="categorical"
          xTitle={lineHeader[0]}
          yTitle={lineHeader[1]}
        />
      );
    case 'pie':
      // convert data to pie data
      const pieHeader = sql_data[0];
      const pieItems = sql_data.slice(1, sql_data.length);
      const pieKeys = ['title', 'value'];
      const pieContent: any = pieItems.map((item) => {
        const map: any = new Map(item.map((value, index) => {
          return [pieKeys[index], value];
        }));
        return Object.fromEntries(map);
      });
      return (
        <PieChart
          data={pieContent}
          detailPopoverContent={(datum, sum) => [
            {key: pieHeader[1], value: datum.value}
          ]}
          hideFilter
        />
      );
    default:
      return null;
  }

}

function IntentSearchPanel(props: ChatMessageProps) {

  const handleUpvote = () => {
    // todo
  };

  const handleDownvote = () => {
    // todo
  };

  switch (props.message.query_intent) {
    case 'normal_search':
      const sql_data = props.message.sql_search_result.sql_data;
      let headers: any = [];
      let content: any = [];
      if (sql_data.length > 0) {
        // convert data from server to generate table
        headers = sql_data[0].map((header: string) => {
          return {
            header: header,
            cell: (item: { [x: string]: any; }) => item[header],
          };
        });
        const items = sql_data.slice(1, sql_data.length);
        content = items.map((item) => {
          const map: any = new Map(item.map((value, index) => {
            return [sql_data[0][index], value];
          }));
          return Object.fromEntries(map);
        });
      }
      return (
        <Container>
          <SpaceBetween size={'s'}>
            {sql_data.length > 0 ?
              <ExpandableSection
                variant="footer"
                defaultExpanded
                headerText="Table">
                <Table
                  columnDefinitions={headers}
                  enableKeyboardNavigation
                  items={content}
                  resizableColumns
                />
              </ExpandableSection> : null
            }
            {props.message.sql_search_result.data_show_type !== "table" && props.message.sql_search_result.sql_data.length > 0 ?
              <ExpandableSection
                variant="footer"
                defaultExpanded
                headerActions={<Button>Edit</Button>}
                headerText="Chart">
                <ChartPanel
                  data_show_type={props.message.sql_search_result.data_show_type}
                  sql_data={props.message.sql_search_result.sql_data}
                />
              </ExpandableSection> : null
            }
            <ExpandableSection
              variant="footer"
              defaultExpanded
              headerText="Answer with insights">
              <div
                style={{whiteSpace: "pre-line"}}>{props.message.sql_search_result.data_analyse}</div>
            </ExpandableSection>
            <ExpandableSection
              variant="footer"
              headerText="SQL">
              <SpaceBetween size={'s'}>
                <div className={styles.sql}>
                  <SyntaxHighlighter language="javascript">
                    {props.message.sql_search_result.sql}
                  </SyntaxHighlighter>
                  <div
                    style={{whiteSpace: "pre-line"}}>{props.message.sql_search_result.sql_gen_process}</div>
                </div>
                <ColumnLayout columns={2}>
                  <Button
                    fullWidth
                    iconName="thumbs-up"
                    onClick={handleUpvote}>
                    Upvote
                  </Button>
                  <Button
                    fullWidth
                    iconName="thumbs-down"
                    onClick={handleDownvote}>
                    Downvote
                  </Button>
                </ColumnLayout>
              </SpaceBetween>
            </ExpandableSection>
          </SpaceBetween>
        </Container>
      );
    case 'reject_search':
      return (
        <Container>
          <div style={{whiteSpace: "pre-line"}}>该搜索系统暂不支持</div>
        </Container>
      );
    case 'agent_search':
      return (
        <Container>
          Todo: agent_search
        </Container>
      );
    case 'knowledge_search':
      return (
        <Container>
          <div style={{whiteSpace: "pre-line"}}>{props.message.knowledge_search_result.knowledge_response}</div>
        </Container>
      );
    default:
      return (
        <Container>
          <div style={{whiteSpace: "pre-line"}}>结果返回错误，请检查您的网络设置，稍后请重试</div>
        </Container>
      );
  }
}

export default function ChatMessage(props: ChatMessageProps) {

  return (
    <SpaceBetween size={'m'}>
      <TextContent>
        <strong>{props.message.query}</strong>
      </TextContent>
      <IntentSearchPanel
        message={props.message}
        onThumbsUp={
          () => {
          }
        }
        onThumbsDown={
          () => {
          }
        }/>
      {props.message.suggested_question.length > 0 ?
        <ExpandableSection
          variant="footer"
          defaultExpanded
          headerText="Suggested questions">
          <SuggestedQuestions questions={props.message.suggested_question}></SuggestedQuestions>
        </ExpandableSection> : null}
    </SpaceBetween>
  );
}