# Nexus Brain compatibility facade

This optional workspace package preserves legacy Maestri/Operating Core exports over the canonical Nexus Brain packages. It owns no authoritative stores, scheduler, router, brain, provider, or execution implementation. New consumers should import the owning package directly; Nexus Brain does not require Maestri or this compatibility facade to run its standalone Context Gateway, Edge, CLI, or Control Center.
