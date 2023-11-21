import React from "react";
import { Heading, PlainText } from "./Text";

// buttons
import { Button } from "./Buttons";
export const View = () => <div className="bg-white p-4 rounded-lg">
  <Heading size={5}>Styled Components</Heading>
  <hr />
  <section>
    <Heading size={3}>Buttons</Heading>
    <Button.Blue>submit</Button.Blue>
    <Button.Red>Download</Button.Red>
    <Button.Yellow>View</Button.Yellow>
    <Button.Purple>Info</Button.Purple>
    <Button.Cyan>Info</Button.Cyan>
    <Button.Green>Accept</Button.Green>
    <Button.Gray>Secondary</Button.Gray>
    <Heading size={4} className="mt-3">Loading Button</Heading>
    <Button.LoadingHollow />
    <Button.LoadingHollow>Custom Loader Message</Button.LoadingHollow>
  </section>
</div>