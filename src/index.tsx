import React from "react";
import { CalculateMetadataFunction, Composition, registerRoot, staticFile } from "remotion";
import { CATALOGO } from "./catalogo";
import { EfeitoProps, FPS, H, Job, JobProvider, W } from "./job";

// Um efeito por composição (id = comando do catálogo). A duração vem do job.json do vídeo preparado.
const metadata: CalculateMetadataFunction<EfeitoProps> = async ({ props }) => {
  const job: Job = await fetch(staticFile("job.json")).then((r) => r.json());
  return { durationInFrames: Math.max(1, Math.floor(job.duration * FPS)), fps: FPS, width: W, height: H, props: { ...props, job } };
};

const comEfeito = (Efeito: React.FC): React.FC<EfeitoProps> => ({ job, variant = "sdr" }) =>
  job ? <JobProvider job={job} variant={variant}><Efeito /></JobProvider> : null;

const Root: React.FC = () => (
  <>
    {CATALOGO.map((e) => (
      <Composition key={e.slug} id={e.slug} component={comEfeito(e.component)} durationInFrames={300} fps={FPS} width={W} height={H}
        defaultProps={{ variant: "sdr" } as EfeitoProps} calculateMetadata={metadata} />
    ))}
  </>
);

registerRoot(Root);
