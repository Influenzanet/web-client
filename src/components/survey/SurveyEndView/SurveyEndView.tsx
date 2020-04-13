import React, { useRef, useEffect, Fragment } from 'react';
import { Container, Typography, Paper, Grid, Box } from '@material-ui/core';
import FlexGrow from '../../common/FlexGrow';
import ParticleText from '../../common/ParticleText/ParticleText';

interface SurveyEndViewProps {
}

const SurveyEndView: React.FC<SurveyEndViewProps> = (props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const emojiPlaceholderRef = useRef<HTMLDivElement>(null);

  const emojiSize = 10;

  const emojiList = ['😃', '😊', '🙂', '😍', '😎', '🤩', '🥳', '😱', '👍', '👌', '💪', '🎊', '🎉', '❤️',];

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.height = `calc(100vh - ${containerRef.current.offsetTop}px)`;
    }
  });

  const getRandomEmoji = () => {
    let index = Math.round(Math.random() * (emojiList.length - 1));
    return emojiList[index];
  }

  const Emoji = () => {
    return (
      <Box py={10}>
        <div ref={emojiPlaceholderRef} style={{ minHeight: `${emojiSize}em` }} />
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, top: 0, pointerEvents: "none" }}>
          <ParticleText
            text={getRandomEmoji()}
            fontSize={emojiSize}
            fontFillStyle=""
            placeholderRef={emojiPlaceholderRef}
          />
        </div>
      </Box>
    );
  }

  const NextStepsBox = (title: string) => {
    return (
      <Grid item xs={12} sm={8} md={4}>
        <Paper elevation={0} style={{ height: 120, padding: 16, margin: 16, borderRadius: 42 }}>
          <Typography variant="h6" align="center">
            {title}
          </Typography>
        </Paper>
      </Grid>
    );
  }

  const NextSteps = () => {
    return (
      <Fragment>
        <Typography variant="h5" color="secondary" align="center">
          Here are some ideas for your next steps:
        </Typography>
        <Grid container justify="center">
          {NextStepsBox("Learn more about this study")}
          {NextStepsBox("Read the news")}
          {NextStepsBox("Improve your health")}
        </Grid>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <Container ref={containerRef} style={{ display: "flex", flexDirection: "column" }}>
        <FlexGrow />
        <Box pt={4}>
          <Typography variant="h3" color="primary" align="center">
            Thank you for participating!
          </Typography>
          <Typography variant="h3" color="secondary" align="center">
            Stay healthy!
          </Typography>
        </Box>
        <FlexGrow />
        <Emoji />
        <FlexGrow />
        <NextSteps />
      </Container>
    </Fragment>
  );
};

export default SurveyEndView;