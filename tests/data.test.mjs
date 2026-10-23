import assert from "node:assert/strict";
import test from "node:test";
import { simulators } from "../data/simulators.ts";
import { articles } from "../data/articles.ts";

test("Simuladores têm endereços únicos", () => {
  const slugs = simulators.map((simulator) => simulator.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  assert.ok(slugs.every((slug) => /^simulador-[a-z0-9-]+$/.test(slug)));
});

test("Campos condicionais e monetários referenciam campos existentes", () => {
  for (const simulator of simulators) {
    const keys = new Set(simulator.fields.map((field) => field.key));
    assert.equal(keys.size, simulator.fields.length, simulator.slug);

    for (const field of simulator.fields) {
      for (const reference of [
        field.currencyUnit,
        field.currencyBase,
        field.when?.[0],
      ]) {
        if (reference)
          assert.ok(
            keys.has(reference),
            `${simulator.slug}: ${field.key} → ${reference}`,
          );
      }
      if (field.currencyUnit) {
        const selector = simulator.fields.find(
          (candidate) => candidate.key === field.currencyUnit,
        );
        assert.ok(selector.options.some(([value]) => value === "reais"));
        assert.ok(selector.options.some(([value]) => value === "percentual"));
        assert.ok(field.currencyBase);
      }
    }
  }
});

test("Opções de seleção incluem o valor inicial do campo", () => {
  for (const simulator of simulators) {
    for (const field of simulator.fields.filter((field) => field.options)) {
      assert.ok(
        field.options.some(([value]) => value === field.value),
        `${simulator.slug}: ${field.key}`,
      );
    }
  }
});

test("Artigos apontam para simuladores existentes", () => {
  for (const [slug, article] of Object.entries(articles)) {
    assert.match(slug, /^[a-z0-9-]+$/);
    assert.ok(article.title);
    assert.ok(article.sections.length > 0);
    assert.ok(
      simulators.some((simulator) => simulator.slug === article.link),
      slug,
    );
  }
});
